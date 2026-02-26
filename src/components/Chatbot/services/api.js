/**
 * API service for RAG chatbot communication
 * Handles communication with the backend RAG service using Gemini + Qdrant
 */

import { QuestionRequest, ApiResponse } from '../models';
import { getChatbotConfig } from '../../../utils/chatbot-config';

class ApiService {
  constructor(config) {
    // If config is provided, use it; otherwise get from Docusaurus context
    if (config) {
      this.config = config;
    } else {
      // Get configuration from Docusaurus customFields
      this.config = getChatbotConfig();
    }
    // Store conversation history for context
    this.conversationHistory = [];
  }

  async sendQuestion(question, context = '') {
    const request = new QuestionRequest(question, context);
    const validation = request.validate();

    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Build the payload for the new RAG API
    const payload = {
      message: request.question,
      history: this.conversationHistory.slice(-10) // Send last 10 messages for context
    };

    try {
      const response = await this._makeRequest(payload);

      // Add to conversation history
      this.conversationHistory.push({ role: 'user', content: question });
      if (response.response) {
        this.conversationHistory.push({ role: 'assistant', content: response.response });
      }

      // Convert the response to ApiResponse format
      return ApiResponse.fromApiData({
        answer: response.response,
        sources: response.sources || [],
        error: null
      });
    } catch (error) {
      console.error('API request failed:', error);
      return new ApiResponse(null, [], error.message || 'Network error occurred');
    }
  }

  // Clear conversation history (for new chat sessions)
  clearHistory() {
    this.conversationHistory = [];
  }

  async _makeRequest(payload, retryCount = 0) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      // Use the new /chat endpoint
      const backendUrl = this.config.backendUrl || this.config.apiUrl || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Handle different HTTP error codes appropriately
        if (response.status === 404) {
          throw new Error('Chatbot API endpoint not found. Please check the backend URL configuration.');
        } else if (response.status >= 500) {
          throw new Error(`Backend server error: ${response.status} ${response.statusText}`);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. The backend server may be slow to respond.');
      }

      // Check if this is a network error (fetch failure)
      if (this._isNetworkError(error)) {
        // If we have retries left, try again
        if (retryCount < this.config.maxRetries) {
          await this._delay(1000 * (retryCount + 1)); // Exponential backoff
          return this._makeRequest(payload, retryCount + 1);
        } else {
          // After all retries, provide a graceful fallback message
          throw new Error('Unable to connect to the chatbot backend. Please check your connection and try again later.');
        }
      }

      // For other errors, re-throw them
      throw error;
    }
  }

  // Health check endpoint
  async checkHealth() {
    try {
      const backendUrl = this.config.backendUrl || this.config.apiUrl || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return await response.json();
      }
      return { status: 'error', qdrant_connected: false, gemini_configured: false };
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error', qdrant_connected: false, gemini_configured: false };
    }
  }

  _isNetworkError(error) {
    // Check if the error is related to network connectivity
    return error.message.includes('fetch') ||
           error.message.includes('network') ||
           error.message.includes('Failed to fetch') ||
           error.message.includes('TypeError') ||
           error.name === 'TypeError' ||
           error.name === 'AbortError';
  }

  _isRetryableError(error) {
    // Retry on network errors, not on validation errors
    return this._isNetworkError(error);
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default ApiService;