# API Contract: RAG Question-Answer Endpoint

## Overview
This document defines the API contract between the frontend chatbot component and the backend RAG service for question answering functionality.

## Endpoint: POST /api/v1/question-answer

### Request
**Method**: POST
**Path**: `/api/v1/question-answer`
**Content-Type**: `application/json`

#### Request Body
```json
{
  "question": "string (required)",
  "context": "string (optional)"
}
```

**Fields**:
- `question`: The user's question to be answered (required)
- `context`: Optional selected text that provides additional context for the question

**Validation**:
- `question` must be 1-2000 characters
- `context` (if provided) must be 1-5000 characters

#### Example Request
```json
{
  "question": "What are the key principles of physical AI?",
  "context": "Physical AI combines robotics and artificial intelligence..."
}
```

### Response
**Success Response**: `200 OK`
**Content-Type**: `application/json`

#### Success Response Body
```json
{
  "answer": "string",
  "sources": ["string"],
  "success": true
}
```

**Fields**:
- `answer`: The AI-generated response to the question
- `sources`: Array of source references from the book content that support the answer
- `success`: Boolean indicating if the request was successful

#### Example Success Response
```json
{
  "answer": "Physical AI is an interdisciplinary field that combines robotics and artificial intelligence...",
  "sources": [
    "Chapter 3: Introduction to Physical AI",
    "Section 4.2: AI-Robotics Integration Principles"
  ],
  "success": true
}
```

### Error Responses

#### Client Error: `400 Bad Request`
```json
{
  "error": "string",
  "success": false
}
```

**Scenarios**:
- Missing required `question` field
- `question` field is empty or exceeds character limits
- Invalid JSON format

#### Server Error: `500 Internal Server Error`
```json
{
  "error": "string",
  "success": false
}
```

**Scenarios**:
- Backend service unavailable
- Qdrant retrieval service error
- OpenAI API error
- Internal processing error

#### Example Error Response
```json
{
  "error": "The RAG service is currently unavailable. Please try again later.",
  "success": false
}
```

### Error Handling Guidelines for Frontend

1. **Network Errors**: Implement retry logic with exponential backoff
2. **4xx Errors**: Display user-friendly error messages explaining what went wrong
3. **5xx Errors**: Display generic error message and suggest retrying later
4. **Timeout**: Display timeout message and allow user to retry
5. **Empty Results**: If no relevant content found, display appropriate message to user