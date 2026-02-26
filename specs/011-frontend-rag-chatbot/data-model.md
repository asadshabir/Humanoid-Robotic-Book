# Data Model: Frontend integration for Agent-based RAG chatbot (Spec-4)

## Overview
This document defines the data models for the frontend chatbot component that integrates with the RAG backend. It captures the entities identified in the feature specification and defines their structure and relationships.

## Entity: QuestionRequest

**Description**: Represents a user's question submitted to the backend, potentially including selected text as context

**Fields**:
- `question` (string, required): The user's question text
- `context` (string, optional): Selected/highlighted text from the page that provides additional context
- `timestamp` (Date, optional): When the question was created (for UI purposes)

**Validation Rules**:
- `question` must not be empty or whitespace only
- `question` length must be less than 2000 characters to prevent abuse
- `context` length must be less than 5000 characters to prevent excessive payload size

## Entity: ChatMessage

**Description**: Represents a message in the chat interface, either from the user or the AI agent

**Fields**:
- `id` (string, required): Unique identifier for the message
- `content` (string, required): The message content
- `sender` (enum, required): Either "user" or "agent"
- `timestamp` (Date, required): When the message was created
- `status` (enum, optional): "pending", "sent", "loading", "error", "completed"

**Validation Rules**:
- `sender` must be either "user" or "agent"
- `content` must not be empty
- `status` must be one of the allowed values

## Entity: ApiResponse

**Description**: Represents the response from the RAG backend including the answer and source references

**Fields**:
- `answer` (string, required): The AI agent's response to the user's question
- `sources` (array of strings, optional): List of source references from the book content
- `error` (string, optional): Error message if the request failed
- `success` (boolean, required): Whether the request was successful

**Validation Rules**:
- `answer` must not be empty if success is true
- `sources` should be an array of strings
- If `error` is present, `success` must be false

## Entity: ChatSession

**Description**: Represents a single interaction session between user and AI agent (without persistence)

**Fields**:
- `id` (string, required): Unique identifier for the session
- `messages` (array of ChatMessage, required): List of messages in the session
- `createdAt` (Date, required): When the session was created
- `lastActive` (Date, required): When the last message was added

**Validation Rules**:
- `messages` must be an array of valid ChatMessage objects
- `messages` length should not exceed 100 to prevent memory issues

## Entity: ChatConfig

**Description**: Configuration settings for the chatbot component

**Fields**:
- `apiUrl` (string, required): The backend API endpoint URL
- `timeout` (number, optional): Request timeout in milliseconds (default: 30000)
- `maxRetries` (number, optional): Number of retry attempts for failed requests (default: 2)

**Validation Rules**:
- `apiUrl` must be a valid URL
- `timeout` must be a positive number
- `maxRetries` must be a non-negative integer

## State Transitions

### ChatMessage Status Transitions
1. `pending` → `sent` (when message is sent to backend)
2. `sent` → `loading` (when waiting for response)
3. `loading` → `completed` (when response received)
4. `loading` → `error` (when error occurs)
5. `error` → `pending` (when user retries)

### Component State Transitions
1. `idle` → `loading` (when user submits question)
2. `loading` → `success` (when response received)
3. `loading` → `error` (when request fails)
4. `error` → `loading` (when user retries)