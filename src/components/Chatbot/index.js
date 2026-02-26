import React from 'react';
import Chatbot from './Chatbot';
import ChatbotErrorBoundary from './ChatbotErrorBoundary';

// Export the Chatbot component wrapped with error boundary
const ChatbotWithErrorBoundary = (props) => {
  return (
    <ChatbotErrorBoundary>
      <Chatbot {...props} />
    </ChatbotErrorBoundary>
  );
};

export default ChatbotWithErrorBoundary;