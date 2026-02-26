# Quickstart Guide: Agent-based RAG Backend

## Overview
This guide will help you set up and run the agent-based RAG backend that uses OpenAI Agents SDK and FastAPI to answer questions about book content using Qdrant retrieval.

## Prerequisites
- Python 3.11+
- OpenAI API key
- Qdrant Cloud account and collection (from Spec-2)
- Environment with access to both APIs

## Setup

### 1. Environment Variables
Create a `.env` file in the project root with the following variables:

```bash
OPENAI_API_KEY=your_openai_api_key_here
QDRANT_API_KEY=your_qdrant_api_key_here
QDRANT_URL=your_qdrant_cluster_url_here
QDRANT_COLLECTION_NAME=your_collection_name_here
```

### 2. Install Dependencies
```bash
pip install openai fastapi uvicorn qdrant-client pydantic python-dotenv
```

### 3. Project Structure
```
backend/
├── agents/
│   ├── rag_agent.py
│   └── tools/
│       └── qdrant_retrieval_tool.py
├── api/
│   ├── main.py
│   └── routes/
│       └── question_answer.py
├── models/
│   ├── request_models.py
│   └── response_models.py
└── config/
    └── settings.py
```

## Running the Service

### 1. Start the API Server
```bash
cd backend
uvicorn api.main:app --reload --port 8000
```

### 2. Test the Endpoint
```bash
curl -X POST http://localhost:8000/api/v1/question-answer \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are the key principles of humanoid robot balance control?",
    "max_results": 5,
    "confidence_threshold": 0.7
  }'
```

## Test Scenarios

### 1. Basic Question Answering
- **Input**: A simple question about book content
- **Expected**: Response with answer and sources from Qdrant

### 2. Low Confidence Query
- **Input**: Question with very low confidence threshold
- **Expected**: More sources returned in the response

### 3. Invalid Query
- **Input**: Empty or malformed query
- **Expected**: 400 error response with validation message

### 4. System Error
- **Input**: Valid query when services are down
- **Expected**: 500 error response with appropriate message

## Troubleshooting

### Qdrant Connection Issues
- Verify QDRANT_URL and QDRANT_API_KEY are correct
- Check that the collection name matches the one created in Spec-2
- Ensure the Qdrant service is accessible from your environment

### OpenAI API Issues
- Verify OPENAI_API_KEY is valid and has sufficient quota
- Check that the API is accessible from your environment
- Review rate limiting if experiencing timeouts

### Performance Issues
- Monitor response times for both Qdrant retrieval and OpenAI calls
- Consider caching frequently accessed embeddings
- Adjust max_results parameter based on performance requirements