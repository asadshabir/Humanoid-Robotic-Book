# ADR 003: Frontend Technology Stack for RAG Chatbot

## Context
The project requires a frontend chatbot component that integrates with the Agent-based RAG backend to enable users to ask questions and receive grounded answers from the book content. Key requirements include:

- Seamless integration with the existing Docusaurus documentation site
- React-based component architecture that follows Docusaurus patterns
- Support for capturing selected text context from documentation pages
- Fast, responsive UI with proper loading and error states
- Accessibility compliance (WCAG AA)
- Compatibility with GitHub Pages deployment

## Decision
We will implement the chatbot using the **Docusaurus/React technology stack** with the following components:

1. **Framework**: Docusaurus 3.x with React 18+ for component architecture
2. **Component Structure**: React functional components with hooks for state management
3. **Styling**: CSS modules for scoped, maintainable styles
4. **API Communication**: Fetch API or axios for backend communication
5. **State Management**: React hooks (useState, useEffect, useRef) for component state
6. **Text Selection**: Native browser selection API to capture selected text context

## Rationale
- Docusaurus provides seamless integration with the existing documentation site structure
- React enables component-based architecture that's maintainable and testable
- CSS modules provide scoped styling without global conflicts
- Native browser APIs provide reliable text selection capture
- React hooks offer simple, functional state management without complex frameworks
- Fetch API is standard and lightweight for API communication
- The stack aligns with existing Docusaurus patterns and developer familiarity

## Alternatives Considered
- **Custom vanilla JavaScript solution**: Rejected due to complexity of state management and DOM manipulation
- **Other frontend frameworks (Vue, Angular)**: Rejected as they would require different build processes and break Docusaurus integration
- **IFrame integration**: Rejected due to complexity in communication with parent page and styling issues
- **Server-side rendering only**: Rejected as it wouldn't allow for dynamic interaction and real-time responses
- **Separate React app embedded in Docusaurus**: Rejected as it would add build complexity and potential styling conflicts

## Status
Proposed

## Consequences

### Positive
- Chatbot integrates seamlessly with existing Docusaurus documentation
- Component-based architecture enables easy testing and maintenance
- Familiar technology stack for React/Docusaurus developers
- Proper separation of concerns between UI and data handling
- Responsive, accessible interface that meets WCAG AA standards
- Lightweight implementation that doesn't significantly impact bundle size

### Negative
- Additional complexity in the Docusaurus build process
- Requires React/JavaScript knowledge for future maintenance
- Potential for styling conflicts with existing Docusaurus themes
- Additional HTTP requests to backend API may impact perceived performance
- Client-side JavaScript dependency means functionality won't work if JS is disabled