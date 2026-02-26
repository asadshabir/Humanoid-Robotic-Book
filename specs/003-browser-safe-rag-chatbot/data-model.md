# Data Model: Browser-safe RAG Chatbot Runtime & Global Access

## Chatbot Configuration Entity

**Fields**:
- `backendUrl` (string): The URL of the RAG backend API
- `timeout` (number): Request timeout in milliseconds (default: 30000)
- `maxRetries` (number): Maximum number of retry attempts (default: 2)
- `enabled` (boolean): Whether the chatbot is enabled (default: true)

**Validation Rules**:
- `backendUrl` must be a valid URL format
- `timeout` must be between 5000 and 60000 milliseconds
- `maxRetries` must be between 0 and 5

**Relationships**:
- Singleton configuration used by ChatbotProvider

## ChatMessage Entity

**Fields**:
- `id` (string): Unique identifier for the message
- `content` (string): The message content
- `sender` (string): 'user' or 'agent'
- `timestamp` (Date): When the message was created
- `status` (string): 'pending', 'sent', 'loading', 'error', 'completed'
- `sources` (array): Array of source documents (for agent responses)

**Validation Rules**:
- `id` must be unique within the conversation
- `content` must not be empty
- `sender` must be either 'user' or 'agent'
- `timestamp` must be a valid date

**Relationships**:
- Belongs to a ChatSession
- Agent messages may have associated sources

## ChatSession Entity

**Fields**:
- `id` (string): Unique identifier for the session
- `messages` (array): Array of ChatMessage objects
- `createdAt` (Date): When the session was created
- `lastActive` (Date): When the session was last used

**Validation Rules**:
- `messages` array should not exceed 100 messages
- `createdAt` and `lastActive` must be valid dates

**State Transitions**:
- Active: When messages are added to the session
- Inactive: When session exceeds timeout period

**Relationships**:
- Contains multiple ChatMessage entities
- Used by ChatbotProvider

## ChatbotState Entity

**Fields**:
- `isOpen` (boolean): Whether the chatbot UI is open
- `isLoading` (boolean): Whether the chatbot is currently loading
- `error` (string): Error message if any
- `selectedText` (string): Currently selected text for context
- `sessionId` (string): Current session ID

**Validation Rules**:
- `error` should be null when no errors exist
- `selectedText` should have reasonable length limits

**State Transitions**:
- Closed → Open: When user clicks chatbot icon
- Open → Closed: When user minimizes chatbot
- Idle → Loading: When user sends a message
- Loading → Idle: When response is received

**Relationships**:
- Associated with a ChatSession
- Contains multiple ChatMessage entities

## API Response Models

### QuestionRequest Model
**Fields**:
- `question` (string): The question to ask
- `context` (string): Optional context from selected text

**Validation Rules**:
- `question` must not be empty
- `question` must be less than 2000 characters
- `context` must be less than 5000 characters

### ApiResponse Model
**Fields**:
- `answer` (string): The answer from the RAG system
- `sources` (array): Array of source documents used
- `success` (boolean): Whether the request was successful
- `error` (string): Error message if request failed

**Validation Rules**:
- `success` and `error` should be consistent
- `sources` should be an array of valid source objects