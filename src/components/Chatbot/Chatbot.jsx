import React, { useState, useRef, useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { ChatSession, ChatConfig, QuestionRequest } from './models';
import { createLoadingMessage, handleApiError } from './utils';
import { getSelectedText, validateSelectedText } from './utils/textSelection';
import ApiService from './services/api';
import styles from './Chatbot.module.css';

const Chatbot = () => {
  const { siteConfig } = useDocusaurusContext();
  const chatbotConfig = siteConfig?.customFields?.chatbot || {};
  const backendUrl = chatbotConfig.backendUrl || 'https://humanoid-robotic-book-backend.vercel.app';
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('checking'); // 'checking', 'connected', 'disconnected'
  const messagesEndRef = useRef(null);
  const chatSession = useRef(new ChatSession());
  const apiService = useRef(null);
  const textSelectionCleanup = useRef(null);

  // Initialize API service with runtime-safe configuration and check connection status
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Initialize ApiService with config from Docusaurus context
    const apiConfig = {
      backendUrl: backendUrl,
      timeout: chatbotConfig.timeout || 30000,
      maxRetries: chatbotConfig.maxRetries || 2
    };
    apiService.current = new ApiService(apiConfig);

    // Check connection status
    const checkConnection = async () => {
      setConnectionStatus('checking');

      try {
        // Try to make a simple request to check if the backend is reachable
        const response = await fetch(`${backendUrl}/health`, {
          method: 'GET',
          mode: 'cors' // Enable CORS for external API calls
        });

        if (response.ok) {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('disconnected');
        }
      } catch (error) {
        console.warn('Chatbot backend connection check failed:', error);
        setConnectionStatus('disconnected');
      }
    };

    checkConnection();
  }, [backendUrl, chatbotConfig]);

  // Set up text selection listener
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Book Assistant</h3>
          <div className={styles.connectionStatus} title={`Connection: ${connectionStatus}`}>
            <span
              className={`${styles.statusIndicator} ${styles[connectionStatus]}`}
              style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor:
                  connectionStatus === 'connected' ? '#4caf50' :
                  connectionStatus === 'disconnected' ? '#f44336' :
                  '#ff9800',
                marginRight: '8px'
              }}
            />
            <span className={styles.statusText}>
              {connectionStatus === 'connected' ? 'Online' :
               connectionStatus === 'disconnected' ? 'Offline' : 'Checking...'}
            </span>
          </div>
        </div>
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