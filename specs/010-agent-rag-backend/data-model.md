# Data Model: Agent-based RAG backend using OpenAI Agents SDK and FastAPI (Spec-3)

## Entity: QuestionRequest
**Description**: Represents a user's question submitted to the system

**Attributes**:
- `query`: string - The user's question text
- `max_results`: integer (optional) - Maximum number of results to retrieve (default: 5)
- `confidence_threshold`: float (optional) - Minimum confidence score for retrieved results (default: 0.7)

**Validation Rules**:
- `query` must not be empty
- `max_results` must be between 1 and 10
- `confidence_threshold` must be between 0.0 and 1.0

## Entity: AgentResponse
**Description**: Contains the agent's answer to the user's question

**Attributes**:
- `answer`: string - The agent's response to the question
- `sources`: array of SourceInfo - List of sources used to generate the answer
- `confidence`: float - Overall confidence score for the response (0.0 to 1.0)
- `tool_calls`: array of ToolCallInfo - Information about tools called during processing

**Validation Rules**:
- `answer` must not be empty
- `confidence` must be between 0.0 and 1.0

## Entity: SourceInfo
**Description**: Information about a source used in the response

**Attributes**:
- `url`: string - URL of the source document
- `content`: string - The text content that was used
- `score`: float - Relevance score from the retrieval
- `chunk_id`: string - Identifier for the specific chunk

**Validation Rules**:
- `url` must be a valid URL
- `content` must not be empty
- `score` must be between 0.0 and 1.0

## Entity: ToolCallInfo
**Description**: Information about a tool call made by the agent

**Attributes**:
- `name`: string - Name of the tool called
- `arguments`: object - Arguments passed to the tool
- `result`: object - Result returned by the tool

**Validation Rules**:
- `name` must not be empty

## Entity: AgentConfiguration
**Description**: Configuration for the OpenAI agent

**Attributes**:
- `model`: string - The model to use for the agent (default: "gpt-4")
- `temperature`: float - Sampling temperature (default: 0.7)
- `max_tokens`: integer - Maximum tokens in the response (default: 1000)
- `system_prompt`: string - System message to guide the agent's behavior

**Validation Rules**:
- `model` must be a valid OpenAI model
- `temperature` must be between 0.0 and 2.0
- `max_tokens` must be positive

## Entity: QdrantRetrievalResult
**Description**: Result from a Qdrant retrieval operation

**Attributes**:
- `id`: string - Document ID
- `payload`: object - Metadata including URL and text content
- `score`: float - Similarity score
- `vector`: array of float - The embedding vector (optional)

**Validation Rules**:
- `score` must be between 0.0 and 1.0
- `payload` must contain required fields (url, text)

## Relationships

- `QuestionRequest` → `AgentResponse`: One-to-one (each question generates one response)
- `AgentResponse` → `SourceInfo`: One-to-many (one response can have multiple sources)
- `AgentResponse` → `ToolCallInfo`: One-to-many (one response can involve multiple tool calls)
- `AgentConfiguration` → `AgentResponse`: One-to-many (one configuration can generate many responses)