/**
 * Color palette for Physical AI & Humanoid Robotics Book
 * Professional, academic color system following accessibility standards
 */

// Primary colors - used for main branding and key elements
export const primary = {
  50: '#eef7ff',  // Lightest primary
  100: '#d0e4ff',
  200: '#a5cfff',
  300: '#74b5f7',
  400: '#4898ec',
  500: '#2d7de0', // Main primary
  600: '#1e64c4',
  700: '#154da6',
  800: '#133f86',
  900: '#12356b', // Darkest primary
};

// Secondary colors - used for supporting elements
export const secondary = {
  50: '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9', // Main secondary
  600: '#0284c0',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
};

// Neutral colors - used for backgrounds, text, and UI elements
export const neutral = {
  50: '#fafafa',   // Lightest neutral
  100: '#f5f5f5',
  200: '#e5e5e5',
  300: '#d4d4d4',
  400: '#a3a3a3',
  500: '#737373',
  600: '#525252',
  700: '#404040',
  800: '#262626',
  900: '#171717',  // Darkest neutral
  950: '#0a0a0a',
};

// Success colors - used for positive feedback
export const success = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e', // Main success
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
};

// Warning colors - used for warnings and caution
export const warning = {
  50: '#fffbeb',
  100: '#fef3c7',
  200: '#fde68a',
  300: '#fcd34d',
  400: '#fbbf24',
  500: '#f59e0b', // Main warning
  600: '#d97706',
  700: '#b45309',
  800: '#92400e',
  900: '#78350f',
};

// Error colors - used for errors and negative feedback
export const error = {
  50: '#fef2f2',
  100: '#fee2e2',
  200: '#fecaca',
  300: '#fca5a5',
  400: '#f87171',
  500: '#ef4444', // Main error
  600: '#dc2626',
  700: '#b91c1c',
  800: '#991b1b',
  900: '#7f1d1d',
};

// Academic and technical colors - specific to robotics content
export const technical = {
  aiBlue: '#1e40af',      // Deep blue for AI content
  roboticsGreen: '#065f46', // Deep green for robotics
  neuralPurple: '#7e22ce',  // Purple for neural networks
  hardwareOrange: '#c2410c', // Orange for hardware
  simulationCyan: '#0891b2', // Cyan for simulation
};

// Theme color mappings for different contexts
export const themeColors = {
  primary: primary[500],
  primaryLight: primary[100],
  primaryDark: primary[700],
  secondary: secondary[500],
  background: neutral[50],
  surface: '#ffffff',
  text: neutral[900],
  textSecondary: neutral[600],
  textTertiary: neutral[500],
  border: neutral[200],
  success: success[500],
  warning: warning[500],
  error: error[500],
};

// Accessibility contrast ratios
export const accessibility = {
  highContrast: {
    text: neutral[950],
    background: neutral[50],
  },
  normalContrast: {
    text: neutral[900],
    background: neutral[50],
  },
  lowContrast: {
    text: neutral[600],
    background: neutral[100],
  },
};

// Export all color scales for flexible usage
export const colorScales = {
  primary,
  secondary,
  neutral,
  success,
  warning,
  error,
  technical,
};

// Default theme configuration
export const defaultTheme = {
  colors: themeColors,
  scales: colorScales,
  accessibility,
};