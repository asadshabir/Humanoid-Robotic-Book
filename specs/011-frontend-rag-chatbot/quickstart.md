# Quickstart: Frontend RAG Chatbot Integration

## Overview
This guide provides a quick setup for implementing the RAG chatbot integration with the Docusaurus book site. Follow these steps to get the chatbot component running in your development environment.

## Prerequisites

1. **Node.js**: Version 18 or higher
2. **Docusaurus**: Project already set up with documentation site
3. **Backend Service**: Running RAG backend at the configured API endpoint
4. **API Keys**: OpenAI and Qdrant keys configured in backend environment

## Development Setup

### 1. Clone and Install Dependencies
```bash
# Navigate to your Docusaurus project
cd docs
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root with your backend API URL:
```env
RAG_API_URL=http://localhost:8000
```

### 3. Run Backend Service
Ensure your RAG backend is running:
```bash
cd backend
pip install -r requirements.txt
uvicorn api.main:app --reload --port 8000
```

### 4. Start Docusaurus Development Server
```bash
cd docs
npm start
```

## Component Integration

### 1. Create the Chatbot Component
Create the main chatbot component at `src/components/Chatbot/Chatbot.jsx`:

```jsx
import React, { useState, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import './Chatbot.module.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const messagesEndRef = useRef(null);

  // Function to get selected text from the page
  const getSelectedText = () => {
    const selectedText = window.getSelection().toString().trim();
    return selectedText;
  };

  // Function to send question to backend
  const sendQuestion = async (question) => {
    const textToInclude = getSelectedText() || selectedText;
    const userMessage = {
      id: Date.now().toString(),
      content: question,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.RAG_API_URL}/api/v1/question-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
          context: textToInclude
        })
      });

      const data = await response.json();

      if (data.success) {
        const agentMessage = {
          id: `agent-${Date.now()}`,
          content: data.answer,
          sender: 'agent',
          sources: data.sources || [],
          timestamp: new Date()
        };
        setMessages(prev => [...prev, agentMessage]);
      } else {
        const errorMessage = {
          id: `error-${Date.now()}`,
          content: data.error || 'An error occurred while processing your question.',
          sender: 'agent',
          isError: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage = {
        id: `error-${Date.now()}`,
        content: 'Network error: Could not reach the RAG service. Please try again.',
        sender: 'agent',
        isError: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>Book Assistant</h3>
      </div>

      <div className="chatbot-messages">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && <ChatMessage message={{ content: 'Thinking...', sender: 'agent', isLoading: true }} />}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={sendQuestion} />
    </div>
  );
};

export default Chatbot;
```

### 2. Create Chat Message Component
Create `src/components/Chatbot/ChatMessage.jsx`:

```jsx
import React from 'react';

const ChatMessage = ({ message }) => {
  const { sender, content, sources, isError, isLoading } = message;

  return (
    <div className={`chat-message ${sender}-message`}>
      <div className="message-content">
        {isLoading ? (
          <div className="loading-indicator">⏳</div>
        ) : (
          <>
            <p>{content}</p>
            {sources && sources.length > 0 && (
              <div className="sources">
                <h4>Sources:</h4>
                <ul>
                  {sources.map((source, index) => (
                    <li key={index}>{source}</li>
                  ))}
                </ul>
              </div>
            )}
            {isError && (
              <div className="error-message">
                ⚠️ An error occurred. Please try again.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
```

### 3. Create Chat Input Component
Create `src/components/Chatbot/ChatInput.jsx`:

```jsx
import React, { useState } from 'react';

const ChatInput = ({ onSend }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSend(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Ask a question about the book content..."
        className="chat-input"
        disabled={false}
      />
      <button type="submit" className="send-button" disabled={!inputValue.trim()}>
        Send
      </button>
    </form>
  );
};

export default ChatInput;
```

### 4. Add CSS Styling
Create `src/components/Chatbot/Chatbot.module.css`:

```css
.chatbot-container {
  display: flex;
  flex-direction: column;
  height: 500px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: white;
}

.chatbot-header {
  background: #25c2a0;
  color: white;
  padding: 12px 16px;
  font-weight: bold;
}

.chatbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-message {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 18px;
  margin-bottom: 8px;
}

.user-message {
  align-self: flex-end;
  background-color: #e3f2fd;
}

.agent-message {
  align-self: flex-start;
  background-color: #f5f5f5;
}

.message-content {
  word-wrap: break-word;
}

.sources {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #ddd;
}

.sources h4 {
  margin: 0 0 4px 0;
  font-size: 0.875rem;
  color: #555;
}

.sources ul {
  margin: 0;
  padding-left: 16px;
  font-size: 0.8rem;
  color: #666;
}

.error-message {
  color: #d32f2f;
  font-size: 0.8rem;
  margin-top: 4px;
}

.chat-input-form {
  display: flex;
  padding: 12px;
  border-top: 1px solid #ddd;
  background: white;
}

.chat-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 18px;
  outline: none;
}

.chat-input:focus {
  border-color: #25c2a0;
}

.send-button {
  margin-left: 8px;
  padding: 10px 16px;
  background-color: #25c2a0;
  color: white;
  border: none;
  border-radius: 18px;
  cursor: pointer;
}

.send-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.loading-indicator {
  color: #999;
  font-style: italic;
}
```

## Integration with Docusaurus Pages

To add the chatbot to specific pages, import and use the component:

```jsx
import Chatbot from '@site/src/components/Chatbot/Chatbot';

// In your page component
<Chatbot />
```

## Testing

### 1. Unit Tests
```bash
npm test
```

### 2. Integration Tests
Test the component with various scenarios:
- Valid questions with and without context
- Error handling (network errors, backend errors)
- Loading states
- Source references display

### 3. End-to-End Test
1. Start both backend and frontend servers
2. Open a documentation page
3. Ask a question in the chatbot
4. Verify response appears with sources if available
5. Test with selected text context
6. Verify error handling works properly

## Environment Configuration

For different environments, configure the API URL in your environment files:

**Development (.env)**:
```
RAG_API_URL=http://localhost:8000
```

**Production (docusaurus.config.js)**:
```js
module.exports = {
  // ... other config
  themeConfig: {
    // ... other theme config
  },
  // Environment variables
  customFields: {
    ragApiUrl: process.env.RAG_API_URL || 'https://your-backend-domain.com'
  }
};
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend has CORS enabled for your frontend domain
2. **API Not Found**: Verify backend service is running and URL is correct
3. **No Response**: Check that OpenAI and Qdrant services are accessible from backend
4. **Component Not Loading**: Verify all required dependencies are installed