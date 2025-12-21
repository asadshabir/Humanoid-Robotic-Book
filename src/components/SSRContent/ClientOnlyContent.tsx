import React, { useState, useEffect } from 'react';

interface ClientOnlyContentProps {
  children: () => React.ReactNode;
  fallback?: React.ReactNode;
}

const ClientOnlyContent: React.FC<ClientOnlyContentProps> = ({ children, fallback = null }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children()}</>;
};

export default ClientOnlyContent;