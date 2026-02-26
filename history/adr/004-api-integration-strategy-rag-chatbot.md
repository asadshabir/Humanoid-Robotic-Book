# ADR 004: API Integration Strategy for RAG Chatbot

## Context
The frontend chatbot component needs to communicate with the existing Agent-based RAG backend to send user questions and receive grounded responses. Key requirements include:

- Integration with the existing FastAPI `/api/v1/question-answer` endpoint
- Support for optional selected text context in queries
- Proper error handling for network and backend failures
- Environment-based configuration for API URLs
- Performance optimization to minimize response times
- Security considerations for API communication

## Decision
We will implement a **direct HTTP API integration** using the following approach:

1. **Communication Protocol**: REST API over HTTPS using POST requests
2. **Request Format**: JSON payload with question and optional context fields
3. **Response Handling**: JSON responses with answer and source references
4. **Configuration**: Environment variable-based API URL configuration
5. **Error Handling**: Comprehensive error handling with user-friendly messages
6. **Retry Logic**: Client-side retry mechanism for failed requests

## Rationale
- Direct HTTP integration provides minimal latency and overhead
- REST API over HTTPS ensures secure communication
- JSON format provides structured data exchange
- Environment-based configuration enables different URLs for dev/prod
- Client-side retry logic provides resilience against temporary failures
- Consistent error handling maintains good user experience during failures
- The approach aligns with the existing backend API design

## Alternatives Considered
- **WebSocket connection**: Rejected as the request-response pattern doesn't require persistent connection
- **GraphQL**: Rejected as the simple query-response model doesn't benefit from GraphQL's features
- **Server-side proxy**: Rejected as it would add unnecessary complexity and latency
- **Caching layer**: Rejected as responses are context-specific and shouldn't be cached
- **Message queue**: Rejected as the synchronous response requirement doesn't fit queue patterns
- **Server-Sent Events**: Rejected as the use case doesn't require streaming responses

## Status
Proposed

## Consequences

### Positive
- Direct communication minimizes latency and complexity
- Standard HTTP/JSON approach is well-understood and debuggable
- Environment configuration enables flexible deployment strategies
- Comprehensive error handling maintains user experience during failures
- Client-side retry logic provides resilience against temporary issues
- Security through HTTPS ensures data privacy

### Negative
- Potential CORS issues between frontend and backend domains
- Direct dependency on backend availability affects frontend functionality
- Network failures directly impact user experience
- No built-in caching may lead to repeated requests for same content
- Error handling complexity increases code maintenance requirements