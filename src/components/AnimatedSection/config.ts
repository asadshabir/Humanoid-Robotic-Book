/**
 * Animation configuration for Physical AI & Humanoid Robotics Book
 * Non-blocking animation policy following progressive enhancement principles
 */

// Animation settings with accessibility in mind
export const animationConfig = {
  // Default animation settings
  defaults: {
    duration: 500,           // 500ms default duration
    easing: 'ease',          // Standard easing
    delay: 0,               // No delay by default
  },

  // Animation types with their specific configurations
  types: {
    fade: {
      duration: 300,
      easing: 'ease',
    },
    'slide-up': {
      duration: 500,
      easing: 'ease-out',
    },
    'slide-down': {
      duration: 500,
      easing: 'ease-out',
    },
    'slide-left': {
      duration: 500,
      easing: 'ease-out',
    },
    'slide-right': {
      duration: 500,
      easing: 'ease-out',
    },
    scale: {
      duration: 350,
      easing: 'ease-out',
    },
  },

  // Animation thresholds for intersection observer
  thresholds: {
    trigger: 0.1,           // 10% of element visible
    rootMargin: '0px 0px -50px 0px',  // Trigger 50px before element enters viewport
  },

  // Animation policy settings
  policy: {
    respectReducedMotion: true,      // Always respect user's reduced motion preference
    progressiveEnhancement: true,    // Animations are enhancements, not core functionality
    fallbackBehavior: 'show-immediately', // How to handle when animations are disabled
    performanceMode: 'auto',         // Auto-detect performance capabilities
  },

  // Animation categories for different content types
  categories: {
    // Content animations - for page content that should be engaging
    content: {
      defaultType: 'fade',
      enabled: true,
    },
    // Navigation animations - subtle animations for navigation
    navigation: {
      defaultType: 'slide-up',
      enabled: true,
      duration: 250,
    },
    // Technical diagrams - only animate if user accepts enhanced experience
    technical: {
      defaultType: 'scale',
      enabled: true,
      requiresConsent: false, // No consent needed for subtle animations
    },
    // Interactive elements - animations for user interactions
    interactive: {
      defaultType: 'scale',
      enabled: true,
      duration: 150,
    },
  },
};

// Utility function to check if animations should be disabled
export const shouldDisableAnimations = (): boolean => {
  // Check for reduced motion preference
  if (typeof window !== 'undefined') {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotionQuery.matches) {
      return true;
    }
  }

  // Additional checks could go here (like performance considerations)
  return !animationConfig.policy.respectReducedMotion;
};

// Animation utility functions
export const getAnimationSettings = (category: keyof typeof animationConfig.categories, override?: Partial<typeof animationConfig.defaults>) => {
  const categorySettings = animationConfig.categories[category];
  const typeSettings = animationConfig.types[categorySettings.defaultType] || animationConfig.defaults;

  return {
    ...animationConfig.defaults,
    ...typeSettings,
    ...categorySettings,
    ...override,
  };
};

// Export type definitions
export type AnimationType = keyof typeof animationConfig.types;
export type AnimationCategory = keyof typeof animationConfig.categories;