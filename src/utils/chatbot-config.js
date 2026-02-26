/**
 * Runtime-safe configuration reader for Docusaurus chatbot
 * Provides safe access to chatbot configuration without using process.env
 */

/**
 * Check if we're in a browser environment
 * @returns {boolean} Whether we're in a browser
 */
function isBrowser() {
  return typeof window !== 'undefined';
}

/**
 * Get Docusaurus context safely
 * @returns {Object|null} Docusaurus context or null if not available
 */
function getDocusaurusContext() {
  try {
    // Only try to access window in browser environment
    if (!isBrowser()) {
      return null;
    }
    // Check if we're in a Docusaurus environment
    if (window.Docusaurus) {
      return window.Docusaurus;
    }
    // For server-side rendering or if context is available through other means
    if (typeof globalThis !== 'undefined' && globalThis.Docusaurus) {
      return globalThis.Docusaurus;
    }
    return null;
  } catch (error) {
    console.warn('Could not access Docusaurus context:', error.message);
    return null;
  }
}

/**
 * Get chatbot configuration from Docusaurus customFields
 * @param {Object} docusaurusConfig - Docusaurus configuration object (optional)
 * @returns {Object} Chatbot configuration with defaults
 */
function getChatbotConfig(docusaurusConfig = null) {
  // If a config object is passed directly, use it
  if (docusaurusConfig && typeof docusaurusConfig === 'object') {
    return {
      backendUrl: docusaurusConfig.customFields?.chatbot?.backendUrl || 'http://localhost:8000',
      enabled: docusaurusConfig.customFields?.chatbot?.enabled !== false, // default to true
      timeout: docusaurusConfig.customFields?.chatbot?.timeout || 30000,
      maxRetries: docusaurusConfig.customFields?.chatbot?.maxRetries || 2
    };
  }

  // Fallback: try to get config from global context
  const docusaurusContext = getDocusaurusContext();
  if (docusaurusContext && docusaurusContext.config) {
    return {
      backendUrl: docusaurusContext.config.customFields?.chatbot?.backendUrl || 'http://localhost:8000',
      enabled: docusaurusContext.config.customFields?.chatbot?.enabled !== false,
      timeout: docusaurusContext.config.customFields?.chatbot?.timeout || 30000,
      maxRetries: docusaurusContext.config.customFields?.chatbot?.maxRetries || 2
    };
  }

  // Default configuration
  return {
    backendUrl: 'http://localhost:8000',
    enabled: true,
    timeout: 30000,
    maxRetries: 2
  };
}

/**
 * Validate backend URL format
 * @param {string} url - URL to validate
 * @returns {boolean} Whether the URL is valid
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    console.warn('Invalid URL provided:', url, error.message);
    return false;
  }
}

/**
 * Validate chatbot configuration
 * @param {Object} config - Chatbot configuration to validate
 * @returns {Object} Validation result with isValid flag and errors array
 */
function validateChatbotConfig(config) {
  const errors = [];

  if (!config.backendUrl) {
    errors.push('backendUrl is required');
  } else if (!isValidUrl(config.backendUrl)) {
    errors.push('backendUrl must be a valid URL');
  }

  if (typeof config.enabled !== 'boolean') {
    errors.push('enabled must be a boolean');
  }

  if (typeof config.timeout !== 'number' || config.timeout < 5000 || config.timeout > 60000) {
    errors.push('timeout must be a number between 5000 and 60000 milliseconds');
  }

  if (typeof config.maxRetries !== 'number' || config.maxRetries < 0 || config.maxRetries > 5) {
    errors.push('maxRetries must be a number between 0 and 5');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export {
  getChatbotConfig,
  isValidUrl,
  validateChatbotConfig,
  getDocusaurusContext
};