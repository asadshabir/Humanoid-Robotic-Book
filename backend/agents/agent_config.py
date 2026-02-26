from typing import Dict, Any, List
from backend.agents.rag_agent import OpenAIAssistantAgent
from backend.agents.tools.qdrant_retrieval_tool import QdrantRetrievalTool
from backend.utils.logging import get_logger


class AgentConfiguration:
    """
    Configuration class for setting up the OpenAI agent with Qdrant tool.
    """

    def __init__(self):
        self.logger = get_logger(__name__)
        self.agent = OpenAIAssistantAgent()
        self.qdrant_tool = QdrantRetrievalTool()

        # Register the Qdrant retrieval tool with the agent
        self._setup_tools()

        # Set up system message for the agent
        self._setup_system_message()

    def _setup_tools(self):
        """
        Register tools with the agent.
        """
        # Add Qdrant retrieval tool
        tool_definition = self.qdrant_tool.get_tool_definition()["function"]
        self.agent.add_tool(
            tool_func=self.qdrant_tool,
            tool_name=tool_definition["name"],
            tool_description=tool_definition["description"],
            parameters=tool_definition["parameters"]
        )
        self.logger.info("Qdrant retrieval tool registered with agent")

    def _setup_system_message(self):
        """
        Set up the system message that guides the agent's behavior.
        """
        self.system_message = """
        You are an AI assistant that helps users find information in book content.
        You must use the qdrant_retrieval tool to search for relevant content before answering questions.
        Only provide answers based on the retrieved content. Do not make up information.
        If no relevant content is found, clearly state that the information is not available in the book.
        Always cite sources from the retrieved content when providing answers.

        Handle edge cases as follows:
        - If the Qdrant tool returns no results, inform the user that no relevant information was found in the book
        - If the Qdrant service is unavailable, inform the user that the search service is temporarily down
        - If you encounter an error while processing, apologize and suggest trying again later
        - If the user's query is unclear, ask for clarification rather than guessing
        - Always be truthful and never fabricate information
        """

    def get_agent(self) -> OpenAIAssistantAgent:
        """
        Get the configured agent instance.

        Returns:
            OpenAIAssistantAgent: Configured agent with Qdrant tool
        """
        return self.agent

    def get_system_message(self) -> str:
        """
        Get the system message for the agent.

        Returns:
            str: System message that guides agent behavior
        """
        return self.system_message

    def run_query(self, user_query: str) -> str:
        """
        Run a query through the configured agent.

        Args:
            user_query: The user's question

        Returns:
            str: The agent's response
        """
        return self.agent.run(user_query, system_message=self.system_message)