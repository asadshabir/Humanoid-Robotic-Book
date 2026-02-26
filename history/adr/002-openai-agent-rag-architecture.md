# ADR 002: OpenAI Agent-based RAG Architecture with Qdrant Integration

## Context
The project requires a backend AI agent capable of answering questions about the book content using the retrieval pipeline (Spec-2). Key requirements include:

- Grounded responses to prevent hallucinations
- Seamless integration with the existing Qdrant vector store
- Fast and scalable API for frontend consumption
- Support for structured tool calls and JSON responses

## Decision
We will implement the agent using the **OpenAI Agents SDK**, exposing it via a **FastAPI backend**. The agent will:

1. Access the **Qdrant retrieval tool** as a callable agent tool.
2. Generate answers strictly based on retrieved chunks.
3. Provide structured JSON responses suitable for frontend consumption.
4. Use Python 3.11 with Pydantic for data validation and FastAPI for API documentation.

## Rationale
- OpenAI Agents SDK provides native tool integration and reasoning capabilities ideal for RAG systems
- FastAPI offers excellent performance, async support, and automatic API documentation
- Qdrant provides proven semantic search capabilities that integrate well with embedding models
- Python ecosystem provides strong support for AI/ML applications with proper error handling
- The agent-tool pattern enables clear separation of concerns between retrieval and generation

## Alternatives Considered
- **Direct LLM queries without retrieval**: Rejected due to risk of hallucination and lack of grounded responses
- **Custom agent implementation without OpenAI SDK**: Rejected due to increased complexity and loss of SDK features (tool management, reasoning chains)
- **Other backend frameworks (Flask, Django)**: Rejected; FastAPI chosen for async support, simplicity, and performance
- **Other vector databases (Pinecone, Weaviate)**: Rejected; Qdrant already validated in codebase and provides excellent semantic search
- **Hybrid approach with direct responses**: Rejected as it would still be prone to hallucination

## Status
Accepted

## Consequences

### Positive
- Agent responses are **grounded and traceable** to Qdrant content
- FastAPI endpoint provides **easy integration** with the frontend (Spec-4)
- Future enhancements (multi-agent, tool chaining) can leverage the OpenAI Agents SDK capabilities
- Automatic API documentation with Swagger/OpenAPI via FastAPI
- Proper data validation with Pydantic models
- Async support enables efficient handling of concurrent requests

### Negative
- Reliance on OpenAI SDK introduces dependency on SDK updates and supported models
- Multiple external services (Qdrant + OpenAI) create potential failure points
- Additional complexity in error handling for external service unavailability
- Potential cost considerations for OpenAI API usage
- Requires careful management of API keys and rate limits