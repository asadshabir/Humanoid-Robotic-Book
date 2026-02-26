from openai import OpenAI
from typing import Dict, Any, List, Optional
from backend.config.settings import settings
from backend.utils.logging import get_logger
import logging


class OpenAIClientWrapper:
    """
    Wrapper for OpenAI client with error handling and configuration.
    """

    def __init__(self):
        self.logger = get_logger(__name__)

        try:
            self.client = OpenAI(api_key=settings.openai_api_key)
            self.model = settings.openai_model
            self.logger.info(f"OpenAI client initialized with model: {self.model}")
        except Exception as e:
            self.logger.error(f"Failed to initialize OpenAI client: {str(e)}")
            raise

    def create_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        tool_choice: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a completion using the OpenAI API.

        Args:
            messages: List of messages in the conversation
            temperature: Sampling temperature (0.0 to 2.0)
            max_tokens: Maximum tokens in the response
            tools: List of tools available to the model
            tool_choice: How the model should choose tools

        Returns:
            Completion response from OpenAI
        """
        try:
            params = {
                "model": self.model,
                "messages": messages,
                "temperature": temperature,
            }

            if max_tokens is not None:
                params["max_tokens"] = max_tokens
            if tools is not None:
                params["tools"] = tools
            if tool_choice is not None:
                params["tool_choice"] = tool_choice

            response = self.client.chat.completions.create(**params)

            # Convert response to dictionary format
            result = {
                "id": response.id,
                "choices": [
                    {
                        "index": choice.index,
                        "message": {
                            "role": choice.message.role,
                            "content": choice.message.content,
                            "tool_calls": [
                                {
                                    "id": tool_call.id,
                                    "type": tool_call.type,
                                    "function": {
                                        "name": tool_call.function.name,
                                        "arguments": tool_call.function.arguments
                                    }
                                }
                                for tool_call in choice.message.tool_calls or []
                            ] if choice.message.tool_calls else []
                        },
                        "finish_reason": choice.finish_reason
                    }
                    for choice in response.choices
                ],
                "created": response.created,
                "model": response.model,
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                } if response.usage else {}
            }

            self.logger.info(f"OpenAI completion completed with model: {self.model}")
            return result

        except Exception as e:
            self.logger.error(f"OpenAI completion failed: {str(e)}")
            # Check if it's an API availability issue
            error_msg = str(e).lower()
            if any(keyword in error_msg for keyword in ["connection", "timeout", "refused", "unavailable", "network", "rate limit", "quota", "api key", "authentication"]):
                self.logger.error("OpenAI API appears to be unavailable or rate limited")
                # Return a structured error response instead of raising
                return {
                    "id": "error",
                    "choices": [{
                        "index": 0,
                        "message": {
                            "role": "assistant",
                            "content": "The AI service is currently unavailable. Please try again later.",
                            "tool_calls": []
                        },
                        "finish_reason": "error"
                    }],
                    "created": 0,
                    "model": self.model,
                    "usage": {}
                }
            else:
                raise

    def create_embedding(
        self,
        input_text: str,
        model: str = "text-embedding-ada-002"
    ) -> List[float]:
        """
        Create an embedding for the given input text.

        Args:
            input_text: Text to create embedding for
            model: Embedding model to use

        Returns:
            Embedding vector as a list of floats
        """
        try:
            response = self.client.embeddings.create(
                model=model,
                input=input_text
            )

            embedding = response.data[0].embedding
            self.logger.info(f"OpenAI embedding created with model: {model}")
            return embedding

        except Exception as e:
            self.logger.error(f"OpenAI embedding creation failed: {str(e)}")
            # Check if it's an API availability issue
            error_msg = str(e).lower()
            if any(keyword in error_msg for keyword in ["connection", "timeout", "refused", "unavailable", "network", "rate limit", "quota", "api key", "authentication"]):
                self.logger.error("OpenAI API appears to be unavailable or rate limited")
                # Return a default embedding (zeros) to allow graceful degradation
                # In a real system, you might want to cache embeddings or use a different approach
                return [0.0] * 1536  # Default size for text-embedding-ada-002
            else:
                raise


class OpenAIAssistantAgent:
    """
    An agent that uses OpenAI's assistant capabilities with tools.
    """

    def __init__(self):
        self.logger = get_logger(__name__)
        self.openai_client = OpenAIClientWrapper()
        self.tools = []

    def add_tool(self, tool_func, tool_name: str, tool_description: str, parameters: Dict[str, Any]):
        """
        Add a tool to the agent's tool list.

        Args:
            tool_func: The function to call when the tool is used
            tool_name: Name of the tool
            tool_description: Description of what the tool does
            parameters: Parameters definition for the tool
        """
        tool_definition = {
            "type": "function",
            "function": {
                "name": tool_name,
                "description": tool_description,
                "parameters": parameters
            }
        }
        self.tools.append({
            "definition": tool_definition,
            "function": tool_func
        })

    def run(self, user_input: str, system_message: str = None) -> str:
        """
        Run the agent with the given user input.

        Args:
            user_input: The user's question or request
            system_message: Optional system message to guide the agent's behavior

        Returns:
            The agent's response
        """
        try:
            # Prepare the messages
            messages = []
            if system_message:
                messages.append({"role": "system", "content": system_message})
            messages.append({"role": "user", "content": user_input})

            # Prepare tools for OpenAI
            tools_list = [tool["definition"] for tool in self.tools]

            # Call OpenAI API with tools
            response = self.openai_client.create_completion(
                messages=messages,
                tools=tools_list if tools_list else None,
                tool_choice="auto" if tools_list else None
            )

            # Process the response
            choice = response["choices"][0]
            message = choice["message"]

            # If the model wants to call a tool
            if message.get("tool_calls"):
                tool_responses = []
                for tool_call in message["tool_calls"]:
                    tool_name = tool_call["function"]["name"]
                    try:
                        tool_args = eval(tool_call["function"]["arguments"])  # In production, use json.loads safely
                    except Exception as e:
                        self.logger.error(f"Failed to parse tool arguments for {tool_name}: {str(e)}")
                        tool_responses.append({
                            "tool_call_id": tool_call["id"],
                            "role": "tool",
                            "name": tool_name,
                            "content": f"Error parsing tool arguments: {str(e)}"
                        })
                        continue

                    # Find the tool and execute it
                    tool_to_call = None
                    for tool in self.tools:
                        if tool["definition"]["function"]["name"] == tool_name:
                            tool_to_call = tool["function"]
                            break

                    if tool_to_call:
                        try:
                            tool_result = tool_to_call(**tool_args)
                            tool_responses.append({
                                "tool_call_id": tool_call["id"],
                                "role": "tool",
                                "name": tool_name,
                                "content": str(tool_result)
                            })
                        except Exception as e:
                            self.logger.error(f"Tool {tool_name} execution failed: {str(e)}")
                            tool_responses.append({
                                "tool_call_id": tool_call["id"],
                                "role": "tool",
                                "name": tool_name,
                                "content": f"Error executing tool: {str(e)}"
                            })
                    else:
                        self.logger.error(f"Tool {tool_name} not found")
                        tool_responses.append({
                            "tool_call_id": tool_call["id"],
                            "role": "tool",
                            "name": tool_name,
                            "content": f"Error: Tool {tool_name} not found"
                        })

                # Add tool responses to messages and call OpenAI again
                for tool_response in tool_responses:
                    messages.append(tool_response)

                # Get final response from OpenAI
                final_response = self.openai_client.create_completion(
                    messages=messages
                )

                final_choice = final_response["choices"][0]
                return final_choice["message"]["content"] or "I couldn't generate a response based on the information retrieved."
            else:
                # If no tool calls, return the content directly
                content = message.get("content", "")
                if not content:
                    return "I couldn't find relevant information to answer your question."
                return content

        except Exception as e:
            self.logger.error(f"Agent run failed: {str(e)}")
            return "Sorry, I encountered an error while processing your request. Please try again later."