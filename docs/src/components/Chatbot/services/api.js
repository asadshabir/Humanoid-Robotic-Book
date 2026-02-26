/**
 * API service for RAG chatbot communication
 * Handles communication with the backend RAG service
 */

import { QuestionRequest, ApiResponse } from '../models';

class ApiService {
  constructor(config) {
    this.config = config;
  }

  async sendQuestion(question, context = '') {
    const request = new QuestionRequest(question, context);
    const validation = request.validate();

    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const payload = {
      question: request.question,
      context: request.context
    };

    try {
      const response = await this._makeRequest(payload);
      return ApiResponse.fromApiData(response);
    } catch (error) {
      console.error('API request failed:', error);
      return new ApiResponse(null, [], error.message || 'Network error occurred');
    }
  }

  async _makeRequest(payload, retryCount = 0) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.config.apiUrl}/api/v1/question-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }

      // If we have retries left and this was a network error, try again
      if (retryCount < this.config.maxRetries && this._isRetryableError(error)) {
        await this._delay(1000 * (retryCount + 1)); // Exponential backoff
        return this._makeRequest(payload, retryCount + 1);
      }

      throw error;
    }
  }

  _isRetryableError(error) {
    // Retry on network errors, not on validation errors
    return error.message.includes('fetch') ||
           error.message.includes('network') ||
           error.message.includes('timeout') ||
           error.name === 'AbortError';
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default ApiService;