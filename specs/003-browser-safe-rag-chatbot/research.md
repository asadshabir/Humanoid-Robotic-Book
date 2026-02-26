# Research: Browser-safe RAG Chatbot Runtime & Global Access

## Decision: Move chatbot config from process.env to docusaurus.config.js customFields
**Rationale**: The current implementation uses process.env in browser code which causes runtime crashes. Docusaurus provides customFields in its configuration that are safely available at runtime in the browser.

**Alternatives considered**:
- Environment variables with Webpack DefinePlugin: Would still require build-time configuration
- JSON configuration file loaded at runtime: Would add an extra HTTP request
- Global JavaScript variable: Would require manual setup in HTML template

## Decision: Create runtime-safe config reader using Docusaurus customFields
**Rationale**: Docusaurus customFields are specifically designed to pass configuration from server to client safely. This approach maintains compatibility with GitHub Pages and avoids process.env usage.

**Alternatives considered**:
- Direct API calls to get config: Would add complexity and dependency on external service
- Local storage: Would require manual setup and not work for initial render
- Query parameters: Would be visible and potentially insecure

## Decision: Implement ChatbotProvider at Layout level
**Rationale**: To make the chatbot accessible from every page, we need to provide the chatbot context at the highest level of the Docusaurus app. The Layout component is the ideal place for this.

**Alternatives considered**:
- App level wrapper: Docusaurus doesn't expose App directly
- Per-page inclusion: Would be repetitive and not meet global access requirement
- Root-level provider: Would require modifying Docusaurus internals

## Decision: Create floating minimized chatbot icon (FAB style)
**Rationale**: A floating action button (FAB) style chatbot icon provides global access without cluttering the UI. It can be minimized by default and expanded when clicked.

**Alternatives considered**:
- Persistent sidebar: Would take up valuable screen space
- Header integration: Would compete with existing navigation
- Page-specific chatbot: Would not meet global access requirement

## Decision: Implement lazy-loading for chatbot component
**Rationale**: Lazy loading prevents the chatbot component from impacting initial page load times, improving performance and user experience.

**Alternatives considered**:
- Eager loading: Would increase initial bundle size
- Code splitting by route: Would not provide global access
- Dynamic imports with suspense: Same approach as lazy loading

## Decision: Add graceful fallback when backend is unreachable
**Rationale**: When the backend API is unavailable, the chatbot should not crash but instead show a user-friendly message and disable chat functionality gracefully.

**Alternatives considered**:
- Silent failure: Would confuse users
- Full page error: Would break the entire site
- Disabled UI state: Best approach for user experience

## Technology Research: Docusaurus Custom Fields
Docusaurus customFields are designed specifically for passing configuration from server to client. They are available in the browser context via `useDocusaurusContext()` hook and are compatible with static site generation and GitHub Pages deployment.

## Technology Research: React Context API
React Context API is the standard approach for providing global state and services in React applications. It's well-suited for providing chatbot services across all components without prop drilling.

## Technology Research: Floating Action Button (FAB) patterns
FAB patterns in web applications typically use CSS positioning with fixed positioning to remain visible as users scroll. The Material Design guidelines provide best practices for size, placement, and interaction patterns that we can adapt.

## Technology Research: Code Splitting and Lazy Loading
React's lazy() function and Suspense component provide built-in support for code splitting. This approach allows loading the chatbot component only when needed, reducing initial bundle size.

## Compatibility Research: GitHub Pages
GitHub Pages supports static site hosting with custom domains and HTTPS. Docusaurus sites built with customFields work seamlessly with GitHub Pages as the configuration is embedded in the build process, not dependent on server-side environment variables.