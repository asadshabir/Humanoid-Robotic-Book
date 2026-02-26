# Research: Frontend integration for Agent-based RAG chatbot (Spec-4)

## Overview
This research document addresses technical questions and unknowns for the frontend integration of the RAG chatbot with the Docusaurus book site. It provides the necessary context to implement the feature according to the specification.

## API Endpoint Details

### Decision: FastAPI Endpoint Integration
**Rationale**: The existing backend provides a `/api/v1/question-answer` endpoint that is already implemented with OpenAI agent and Qdrant retrieval functionality. This endpoint accepts a question and optional context, and returns a grounded response with source references.

**Endpoint Contract**:
- Method: POST
- Path: `/api/v1/question-answer`
- Request body: `{ "question": "user question", "context": "optional selected text" }`
- Response: `{ "answer": "response text", "sources": ["source1", "source2"] }`

## Docusaurus Component Architecture

### Decision: React Component Integration
**Rationale**: Docusaurus is built on React, making it natural to implement the chatbot as a React component that can be embedded in documentation pages. The component will follow Docusaurus theming and styling conventions.

**Alternatives considered**:
1. Custom element/web component - Would add complexity without clear benefits
2. Iframe integration - Would complicate state management and styling
3. Server-side include - Would not allow for dynamic interaction

## Text Selection Implementation

### Decision: Document-level Text Selection Capture
**Rationale**: To support User Story 3 (selected text context), the component will implement a document-level text selection listener that captures selected text when the user interacts with the chat interface. This approach works across all documentation pages without requiring modifications to existing content.

**Implementation approach**:
- Use `window.getSelection()` to capture currently selected text
- Add event listeners for selection changes
- Store selected text in component state when user opens chat or submits query

## UI Positioning Strategy

### Decision: Floating Widget Design
**Rationale**: A floating widget positioned in the bottom-right corner provides easy access without interfering with documentation content. This follows common chatbot UI patterns while respecting the existing Docusaurus layout.

**Alternatives considered**:
1. Sidebar integration - Would require significant layout changes to Docusaurus theme
2. Dedicated page - Would require navigation away from documentation content
3. Inline integration - Would clutter documentation pages

## Environment Configuration

### Decision: Environment Variable for API URL
**Rationale**: Following the specification requirement (FR-007), the API URL will be configurable via environment variables. Docusaurus supports environment variables through its build process, allowing different URLs for development and production.

**Implementation**:
- Use `process.env.RAG_API_URL` in the component
- Provide fallback URL for local development
- Configure in `.env` file for local and CI/CD environments

## Error Handling Strategy

### Decision: Graceful Degradation with User Feedback
**Rationale**: To meet requirement FR-006 (error handling), the component will implement multiple error states with clear user messaging. This ensures the chatbot doesn't break the overall user experience when backend services are unavailable.

**Error states to handle**:
- Network errors during API requests
- Backend service unavailability
- Invalid responses from API
- Timeout scenarios

## Accessibility Considerations

### Decision: WCAG AA Compliance
**Rationale**: The implementation must meet WCAG AA standards as per the project constitution. This includes keyboard navigation, screen reader support, and proper ARIA attributes.

**Implementation approach**:
- Use semantic HTML elements
- Implement proper focus management
- Add ARIA labels and descriptions
- Ensure keyboard navigation works for all interactive elements