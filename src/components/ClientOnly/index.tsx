import React, { useState, useEffect } from 'react';

/**
 * ClientOnly component that only renders children in the browser
 * This prevents SSR issues with browser-specific APIs
 */
const ClientOnly = ({ children }: { children: () => React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children()}</>;
};

export default ClientOnly;