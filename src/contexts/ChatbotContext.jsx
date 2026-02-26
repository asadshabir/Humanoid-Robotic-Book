import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getChatbotConfig } from '../utils/chatbot-config';

const ChatbotContext = createContext();

// Initial state for the chatbot
const initialState = {
  isOpen: false,
  isLoading: false,
  error: null,
  selectedText: '',
  sessionId: null,
  messages: [],
  config: null, // Will be set in useEffect to avoid SSR issues
  hasUnreadMessages: false,
  minimized: false
};

// Reducer to handle chatbot state changes
const chatbotReducer = (state, action) => {
  switch (action.type) {
    case 'SET_OPEN':
      return {
        ...state,
        isOpen: action.isOpen,
        hasUnreadMessages: action.isOpen ? false : state.hasUnreadMessages
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.error
      };
    case 'SET_SELECTED_TEXT':
      return {
        ...state,
        selectedText: action.selectedText
      };
    case 'SET_SESSION_ID':
      return {
        ...state,
        sessionId: action.sessionId
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message],
        hasUnreadMessages: !state.isOpen // Mark as unread if chatbot is closed
      };
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
        hasUnreadMessages: false
      };
    case 'UPDATE_CONFIG':
      return {
        ...state,
        config: action.config
      };
    case 'SET_MINIMIZED':
      return {
        ...state,
        minimized: action.minimized,
        isOpen: action.minimized ? false : state.isOpen // If minimized, close the chatbot
      };
    case 'RESET':
      return {
        ...initialState,
        config: state.config // Preserve config
      };
    default:
      return state;
  }
};

// Provider component
export const ChatbotProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatbotReducer, initialState);

  // Function to toggle chatbot open/close state
  const toggleChatbot = () => {
    dispatch({ type: 'SET_OPEN', isOpen: !state.isOpen });
  };

  // Function to open chatbot
  const openChatbot = () => {
    dispatch({ type: 'SET_OPEN', isOpen: true });
  };

  // Function to close chatbot
  const closeChatbot = () => {
    dispatch({ type: 'SET_OPEN', isOpen: false });
  };

  // Function to set loading state
  const setLoading = (isLoading) => {
    dispatch({ type: 'SET_LOADING', isLoading });
  };

  // Function to set error
  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', error });
  };

  // Function to set selected text
  const setSelectedText = (selectedText) => {
    dispatch({ type: 'SET_SELECTED_TEXT', selectedText });
  };

  // Function to set session ID
  const setSessionId = (sessionId) => {
    dispatch({ type: 'SET_SESSION_ID', sessionId });
  };

  // Function to add a message
  const addMessage = (message) => {
    dispatch({ type: 'ADD_MESSAGE', message });
  };

  // Function to clear messages
  const clearMessages = () => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  };

  // Function to update config
  const updateConfig = (config) => {
    dispatch({ type: 'UPDATE_CONFIG', config });
  };

  // Function to set minimized state
  const setMinimized = (minimized) => {
    dispatch({ type: 'SET_MINIMIZED', minimized });
  };

  // Function to reset state
  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  // Effect to initialize config from Docusaurus
  useEffect(() => {
    const config = getChatbotConfig();
    dispatch({ type: 'UPDATE_CONFIG', config });
  }, []);

  const value = {
    ...state,
    toggleChatbot,
    openChatbot,
    closeChatbot,
    setLoading,
    setError,
    setSelectedText,
    setSessionId,
    addMessage,
    clearMessages,
    updateConfig,
    setMinimized,
    reset
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};

// Custom hook to use the chatbot context
export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

export default ChatbotContext;