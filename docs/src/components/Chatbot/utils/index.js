/**
 * Utilities for the chatbot component
 * Includes error handling, loading states, and other helper functions
 */

// Error handling utilities
export class ChatError extends Error {
  constructor(message, type = 'general') {
    super(message);
    this.name = 'ChatError';
    this.type = type; // 'network', 'validation', 'api', 'general'
    this.timestamp = new Date();
  }
}

export const handleApiError = (error) => {
  if (error.message.includes('timeout')) {
    return new ChatError('Request timed out. Please try again.', 'network');
  } else if (error.message.includes('fetch') || error.message.includes('network')) {
    return new ChatError('Network error. Please check your connection.', 'network');
  } else if (error.message.includes('400') || error.message.includes('validation')) {
    return new ChatError('Invalid request. Please check your input.', 'validation');
  } else if (error.message.includes('500')) {
    return new ChatError('Server error. Please try again later.', 'api');
  } else {
    return new ChatError(error.message || 'An unexpected error occurred.', 'general');
  }
};

// Loading state utilities
export const createLoadingMessage = (id = `loading-${Date.now()}`) => ({
  id,
  content: 'Thinking...',
  sender: 'agent',
  status: 'loading',
  timestamp: new Date(),
  isLoading: true
});

export const updateMessageStatus = (message, newStatus) => ({
  ...message,
  status: newStatus
});

// Text selection utilities (will be expanded in User Story 3)
export const getSelectedText = () => {
  const selection = window.getSelection();
  return selection ? selection.toString().trim() : '';
};

// Validation utilities
export const validateQuestion = (question) => {
  if (!question || question.trim().length === 0) {
    return { isValid: false, error: 'Question cannot be empty' };
  }

  if (question.length > 2000) {
    return { isValid: false, error: 'Question is too long (max 2000 characters)' };
  }

  return { isValid: true };
};

export const validateContext = (context) => {
  if (context && context.length > 5000) {
    return { isValid: false, error: 'Context is too long (max 5000 characters)' };
  }

  return { isValid: true };
};

// Utility to delay execution
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Utility to format timestamps for display
export const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Utility to generate unique IDs
export const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;