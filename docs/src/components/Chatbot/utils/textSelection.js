/**
 * Text selection utilities for the chatbot component
 * Handles capturing selected text from the page to include as context
 */

/**
 * Gets the currently selected text from the page
 * @returns {string} The selected text, or empty string if no text is selected
 */
export const getSelectedText = () => {
  const selection = window.getSelection?.();
  return selection ? selection.toString().trim() : '';
};

/**
 * Gets the currently selected text with additional context
 * @returns {Object} Object containing the selected text and metadata
 */
export const getSelectedTextWithContext = () => {
  const selection = window.getSelection?.();

  if (!selection || selection.toString().trim() === '') {
    return {
      text: '',
      rect: null,
      range: null
    };
  }

  const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
  const rect = range ? range.getBoundingClientRect() : null;

  return {
    text: selection.toString().trim(),
    rect,
    range
  };
};

/**
 * Validates the length of selected text according to data model constraints
 * @param {string} text - The selected text to validate
 * @returns {Object} Validation result with isValid flag and error message if invalid
 */
export const validateSelectedText = (text) => {
  if (!text) {
    return { isValid: true }; // Empty text is valid (no context)
  }

  if (text.length > 5000) {
    return {
      isValid: false,
      error: 'Selected text is too long (max 5000 characters). Please select a smaller portion of text.'
    };
  }

  return { isValid: true };
};

/**
 * Gets selected text and validates it
 * @returns {Object} Object with text and validation result
 */
export const getValidatedSelectedText = () => {
  const selectedText = getSelectedText();
  const validation = validateSelectedText(selectedText);

  return {
    text: selectedText,
    validation
  };
};

/**
 * Adds a listener for text selection changes
 * @param {Function} callback - Function to call when text selection changes
 * @returns {Function} Function to remove the listener
 */
export const addTextSelectionListener = (callback) => {
  const handleSelectionChange = () => {
    const { text, validation } = getValidatedSelectedText();
    callback(text, validation);
  };

  document.addEventListener('selectionchange', handleSelectionChange);

  // Return cleanup function
  return () => {
    document.removeEventListener('selectionchange', handleSelectionChange);
  };
};

/**
 * Gets selected text with position information for UI indicators
 * @returns {Object} Object containing selected text and position information
 */
export const getSelectedTextWithPosition = () => {
  const selection = window.getSelection?.();

  if (!selection || selection.toString().trim() === '') {
    return {
      text: '',
      position: null,
      isWithinViewport: false
    };
  }

  const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
  if (!range) {
    return {
      text: selection.toString().trim(),
      position: null,
      isWithinViewport: false
    };
  }

  const rect = range.getBoundingClientRect();
  const isWithinViewport = rect.top >= 0 &&
                           rect.left >= 0 &&
                           rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                           rect.right <= (window.innerWidth || document.documentElement.clientWidth);

  return {
    text: selection.toString().trim(),
    position: {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height
    },
    isWithinViewport
  };
};