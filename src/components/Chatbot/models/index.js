/**
 * Data models for the chatbot component
 * Based on the data model specification
 */

// ChatMessage model
export class ChatMessage {
  constructor(id, content, sender, timestamp = new Date()) {
    this.id = id;
    this.content = content;
    this.sender = sender; // 'user' or 'agent'
    this.timestamp = timestamp;
    this.status = 'completed'; // 'pending', 'sent', 'loading', 'error', 'completed'
  }

  static createFromApiResponse(apiResponse) {
    return new ChatMessage(
      `agent-${Date.now()}`,
      apiResponse.answer,
      'agent',
      new Date()
    );
  }

  static createUserMessage(content) {
    return new ChatMessage(
      `user-${Date.now()}`,
      content,
      'user',
      new Date()
    );
  }
}

// QuestionRequest model
export class QuestionRequest {
  constructor(question, context = '') {
    this.question = question;
    this.context = context;
    this.timestamp = new Date();
  }

  validate() {
    const errors = [];

    if (!this.question || this.question.trim().length === 0) {
      errors.push('Question cannot be empty');
    }

    if (this.question.length > 2000) {
      errors.push('Question must be less than 2000 characters');
    }

    if (this.context && this.context.length > 5000) {
      errors.push('Context must be less than 5000 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// ApiResponse model
export class ApiResponse {
  constructor(answer, sources = [], error = null) {
    this.answer = answer;
    this.sources = sources;
    this.error = error;
    this.success = !error;
  }

  static fromApiData(data) {
    if (data.success === false) {
      return new ApiResponse(null, [], data.error || 'Unknown error');
    }

    return new ApiResponse(
      data.answer || '',
      data.sources || [],
      null
    );
  }
}

// ChatSession model
export class ChatSession {
  constructor() {
    this.id = `session-${Date.now()}`;
    this.messages = [];
    this.createdAt = new Date();
    this.lastActive = new Date();
  }

  addMessage(message) {
    this.messages.push(message);
    this.lastActive = new Date();
  }

  getMessages() {
    return [...this.messages]; // Return a copy to prevent external mutation
  }

  validate() {
    if (this.messages.length > 100) {
      return {
        isValid: false,
        error: 'Too many messages in session, please start a new conversation'
      };
    }

    return { isValid: true };
  }
}

// ChatConfig model
export class ChatConfig {
  constructor(apiUrl, timeout = 30000, maxRetries = 2) {
    this.apiUrl = apiUrl;
    this.timeout = timeout;
    this.maxRetries = maxRetries;
  }

  static fromEnvironment() {
    // Fallback method for backward compatibility
    // In browser environment, process.env will be undefined, so it defaults to localhost
    return new ChatConfig(
      typeof process !== 'undefined' && process.env && process.env.RAG_API_URL
        ? process.env.RAG_API_URL
        : 'http://localhost:8000',
      typeof process !== 'undefined' && process.env && process.env.RAG_API_TIMEOUT
        ? parseInt(process.env.RAG_API_TIMEOUT) || 30000
        : 30000,
      typeof process !== 'undefined' && process.env && process.env.RAG_API_MAX_RETRIES
        ? parseInt(process.env.RAG_API_MAX_RETRIES) || 2
        : 2
    );
  }

  static fromDocusaurus(docusaurusConfig) {
    // Get configuration from Docusaurus customFields
    const chatbotConfig = docusaurusConfig?.customFields?.chatbot || {};

    return new ChatConfig(
      chatbotConfig.backendUrl || 'http://localhost:8000',
      chatbotConfig.timeout || 30000,
      chatbotConfig.maxRetries || 2
    );
  }
}