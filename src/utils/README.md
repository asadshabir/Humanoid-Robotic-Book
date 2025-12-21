# SSR-Safe Patterns Documentation

This document outlines the server-side rendering (SSR) safe patterns to follow when developing components for the Physical AI & Humanoid Robotics book Docusaurus site.

## Overview

Server-side rendering requires special attention to avoid accessing browser-specific APIs during the rendering process. The following patterns ensure components work safely both during server rendering and client-side hydration.

## Core Principles

1. **Never access browser APIs directly** during component rendering
2. **Always check environment** before accessing window, document, or navigator
3. **Use fallback values** when browser APIs are not available
4. **Defer browser-specific operations** until after component mounts

## Utility Functions

The `ssr-safe.ts` module provides the following utility functions:

### `isBrowser()`
Check if code is running in a browser environment.

```typescript
import { isBrowser } from '@site/src/utils/ssr-safe';

if (isBrowser()) {
  // Safe to access browser APIs
  const width = window.innerWidth;
}
```

### `isServer()`
Check if code is running in a Node.js environment.

```typescript
import { isServer } from '@site/src/utils/ssr-safe';

if (isServer()) {
  // Perform server-only operations
  console.log('Rendering on server');
}
```

### `safeWindowAccess(accessor, fallback)`
Safely access window properties with a fallback.

```typescript
import { safeWindowAccess } from '@site/src/utils/ssr-safe';

const screenWidth = safeWindowAccess(() => window.screen.width, 1024);
```

### `safeDocumentAccess(accessor, fallback)`
Safely access document properties with a fallback.

```typescript
import { safeDocumentAccess } from '@site/src/utils/ssr-safe';

const documentTitle = safeDocumentAccess(() => document.title, 'Default Title');
```

### `clientOnlyImport(importFn)`
Import modules only on the client-side.

```typescript
import { clientOnlyImport } from '@site/src/utils/ssr-safe';

const chartModule = await clientOnlyImport(() => import('chart-library'));
```

## React Component Patterns

### Use useEffect for Browser APIs

```typescript
import React, { useState } from 'react';
import { isBrowser } from '@site/src/utils/ssr-safe';

const MyComponent = () => {
  const [width, setWidth] = useState(0);

  React.useEffect(() => {
    if (isBrowser()) {
      const handleResize = () => {
        setWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);
      handleResize(); // Initial call

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return <div>Width: {width}px</div>;
};
```

### Conditional Rendering with ClientOnly

For components that must only render on the client, create a ClientOnly component:

```typescript
import React, { useState, useEffect } from 'react';
import { isBrowser } from '@site/src/utils/ssr-safe';

const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    if (isBrowser()) {
      setHasMounted(true);
    }
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

// Usage
const MyBrowserOnlyComponent = () => (
  <ClientOnly>
    <div>This only renders in the browser</div>
  </ClientOnly>
);
```

## Common Pitfalls to Avoid

### ❌ Don't do this:
```typescript
// This will break SSR
const width = window.innerWidth; // Error on server
```

### ✅ Do this instead:
```typescript
// This is SSR-safe
import { safeWindowAccess } from '@site/src/utils/ssr-safe';

const width = safeWindowAccess(() => window.innerWidth, 1024);
```

### ❌ Don't do this:
```typescript
// This will break SSR
import { SomeBrowserLibrary } from 'some-browser-library';
```

### ✅ Do this instead:
```typescript
// This is SSR-safe
import { clientOnlyImport } from '@site/src/utils/ssr-safe';

const module = await clientOnlyImport(() => import('some-browser-library'));
```

## Validation

To ensure your components are SSR-safe:
1. Run `npm run build` - this will catch SSR errors
2. Use the utility functions provided in `ssr-safe.ts`
3. Test components in both development and production builds
4. Avoid direct access to browser globals in render methods

## Testing SSR Safety

Components should be tested with:
- `npm run build` (builds the site for production)
- Server rendering simulation
- Client-side hydration

If the build completes without errors, the components are likely SSR-safe.