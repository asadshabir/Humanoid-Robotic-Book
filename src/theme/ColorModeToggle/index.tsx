import React, { useEffect, useState } from 'react';
import { useColorMode, useThemeConfig } from '@docusaurus/theme-common';
import { Icon } from '@iconify/react';

interface ColorModeToggleProps {
  className?: string;
}

const ColorModeToggle: React.FC<ColorModeToggleProps> = ({ className }) => {
  const [loaded, setLoaded] = useState(false);
  const { colorMode, setColorMode } = useColorMode();
  const { colorMode: themeConfig } = useThemeConfig();

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <div className={`color-mode-toggle ${className || ''}`} aria-label="Loading theme toggle" />;
  }

  const isDark = colorMode === 'dark';

  const toggleColorMode = () => {
    setColorMode(isDark ? 'light' : 'dark');
  };

  // Use accessible button with proper ARIA attributes
  return (
    <button
      className={`color-mode-toggle ${className || ''}`}
      onClick={toggleColorMode}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      type="button"
    >
      {isDark ? (
        <Icon icon="ph:sun-bold" width="20" height="20" aria-hidden="true" />
      ) : (
        <Icon icon="ph:moon-bold" width="20" height="20" aria-hidden="true" />
      )}
    </button>
  );
};

export default ColorModeToggle;