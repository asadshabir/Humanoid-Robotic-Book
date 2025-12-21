import React, { useState, useEffect } from 'react';
import { isBrowser } from '@site/src/utils/ssr-safe';

interface SSRContentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  clientOnly?: boolean;
  onClientRender?: () => void;
}

const SSRContent: React.FC<SSRContentProps> = ({
  children,
  fallback = null,
  clientOnly = false,
  onClientRender
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (isBrowser()) {
      setIsClient(true);
      if (onClientRender) {
        onClientRender();
      }
    }
  }, []);

  // If clientOnly is true, only render on the client side
  if (clientOnly && !isClient) {
    return <>{fallback}</>;
  }

  // If not clientOnly, render on both server and client
  if (!clientOnly) {
    return <>{children}</>;
  }

  // For clientOnly content, show fallback until client-side render
  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default SSRContent;