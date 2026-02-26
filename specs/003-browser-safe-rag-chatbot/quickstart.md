# Quickstart: Browser-safe RAG Chatbot Runtime & Global Access

## Overview
This guide explains how to set up and use the browser-safe RAG chatbot that is accessible from every page of the Docusaurus site.

## Configuration

### 1. Update Docusaurus Configuration
Add chatbot configuration to your `docusaurus.config.js`:

```javascript
module.exports = {
  // ... other config
  customFields: {
    chatbot: {
      backendUrl: 'http://localhost:8000', // Your RAG backend URL
      enabled: true, // Whether the chatbot is enabled
      timeout: 30000, // Request timeout in milliseconds
      maxRetries: 2 // Maximum number of retry attempts
    }
  },
  // ... rest of config
};
```

### 2. Verify Layout Integration
The chatbot provider should be integrated into the Layout component to make it globally available.

## Usage

### Accessing the Chatbot
- A floating chatbot icon will appear on all pages
- Click the icon to open the chat interface
- The chatbot will remember your conversation across page navigations

### Providing Context
- Select text on any page to provide context to the chatbot
- The selected text will appear as context in the chat interface
- Ask questions related to the selected content for better responses

## Development

### Running Locally
```bash
npm start
```

The chatbot will be available on all pages during development.

### Building for Production
```bash
npm run build
```

The chatbot will be available in the production build and work on GitHub Pages.

## Troubleshooting

### Chatbot Not Appearing
- Verify that `customFields.chatbot.enabled` is set to `true`
- Check browser console for any JavaScript errors
- Ensure the Layout component includes the ChatbotProvider

### Backend Connection Issues
- Verify the `backendUrl` is correct and accessible
- Check that the backend service is running
- Look for CORS errors in the browser console

### Performance Issues
- The chatbot component is lazy-loaded to minimize impact on page load
- If experiencing performance issues, verify the backend response times