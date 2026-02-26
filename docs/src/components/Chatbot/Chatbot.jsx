import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { ChatSession, ChatConfig, QuestionRequest } from './models';
import { createLoadingMessage, handleApiError } from './utils';
import { getSelectedText, validateSelectedText } from './utils/textSelection';
import ApiService from './services/api';
import styles from './Chatbot.module.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const messagesEndRef = useRef(null);
  const chatSession = useRef(new ChatSession());
  const apiService = useRef(null);
  const textSelectionCleanup = useRef(null);

  // Initialize API service with configuration
  useEffect(() => {
    const config = ChatConfig.fromEnvironment();
    apiService.current = new ApiService(config);
  }, []);

  // Set up text selection listener
  useEffect(() => {
    const handleSelectionChange = () => {
      const currentSelection = getSelectedText();
      setSelectedText(currentSelection);
    };

    document.addEventListener('selectionchange', handleSelectionChange);

    // Store cleanup function
    textSelectionCleanup.current = () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };

    // Initial check
    handleSelectionChange();

    // Cleanup on unmount
    return () => {
      if (textSelectionCleanup.current) {
        textSelectionCleanup.current();
      }
    };
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendQuestion = async (question) => {
    // Determine context - use selected text if available and valid
    let context = '';
    if (selectedText) {
      const validation = validateSelectedText(selectedText);
      if (validation.isValid) {
        context = selectedText;
      }
    }

    // Add user message to chat
    const userMessage = {
      id: `user-${Date.now()}`,
      content: question,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send question to API with context
      const response = await apiService.current.sendQuestion(question, context);

      if (response.success) {
        // Add agent response to chat
        const agentMessage = {
          id: `agent-${Date.now()}`,
          content: response.answer,
          sender: 'agent',
          sources: response.sources || [],
          timestamp: new Date()
        };
        setMessages(prev => [...prev, agentMessage]);
        chatSession.current.addMessage(userMessage);
        chatSession.current.addMessage(agentMessage);
      } else {
        // Add error message to chat
        const errorMessage = {
          id: `error-${Date.now()}`,
          content: response.error,
          sender: 'agent',
          isError: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      // Handle unexpected errors
      const errorObj = handleApiError(error);
      const errorMessage = {
        id: `error-${Date.now()}`,
        content: errorObj.message,
        sender: 'agent',
        isError: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Clear selected text after sending
      if (textSelectionCleanup.current) {
        // Temporarily remove listener to avoid updating selectedText during state update
        document.removeEventListener('selectionchange', textSelectionCleanup.current);
        setSelectedText('');
        // Re-add listener
        const handleSelectionChange = () => {
          const currentSelection = getSelectedText();
          setSelectedText(currentSelection);
        };
        document.addEventListener('selectionchange', handleSelectionChange);
        textSelectionCleanup.current = () => {
          document.removeEventListener('selectionchange', handleSelectionChange);
        };
      }
    }
  };

  return (
    <div className={styles.chatbotContainer} role="region" aria-label="Chat interface">
      <div className={styles.chatbotHeader}>
        <h3>Book Assistant</h3>
      </div>

      <div className={styles.chatMessages} aria-live="polite">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && <ChatMessage message={createLoadingMessage()} />}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={handleSendQuestion} disabled={isLoading} />

      {/* Display selected text indicator */}
      {selectedText && (
        <div className={styles.selectedTextIndicator}>
          <small>Context: "{selectedText.substring(0, 50)}{selectedText.length > 50 ? '...' : ''}"</small>
        </div>
      )}
    </div>
  );
};

export default Chatbot;