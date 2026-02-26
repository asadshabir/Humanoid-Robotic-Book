/**
 * Mock API service for testing the chatbot component
 * Simulates API responses for development and testing
 */

class MockApiService {
  constructor(config) {
    this.config = config;
    // Simulate some delay for realistic testing
    this.delay = config?.delay || 1000;
  }

  async sendQuestion(question, context = '') {
    // Simulate API delay
    await this._delay(this.delay);

    // Simple mock responses based on question content
    const mockResponses = [
      "Based on the book content, this is a mock response to your question.",
      "According to the documentation, the answer to your question is quite straightforward.",
      "The book explains this concept in detail in the relevant chapter.",
      "Based on the source material, here's what I can tell you about your question."
    ];

    // Randomly select a mock response
    const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    // Mock sources
    const mockSources = [
      "Chapter 3: Introduction to AI Concepts",
      "Section 4.2: Implementation Patterns",
      "Page 127: Advanced Techniques"
    ];

    // Simulate occasional errors for testing
    const shouldError = Math.random() < 0.1; // 10% chance of error

    if (shouldError) {
      return {
        answer: null,
        sources: [],
        error: "Mock API error: Simulated network issue. Please try again.",
        success: false
      };
    }

    return {
      answer: response,
      sources: mockSources,
      error: null,
      success: true
    };
  }

  async _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default MockApiService;