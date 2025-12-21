# Data Model: Premium Animated UI for Robotics Book

## Key Entities

### Animation Configuration
- **Description**: Settings that control animation behavior, including duration, easing, and enabled/disabled state based on user preferences
- **Attributes**:
  - animationDuration: time unit (e.g., 0.3s)
  - animationEasing: CSS timing function (e.g., cubic-bezier(0.4, 0, 0.2, 1))
  - animationEnabled: boolean (respects reduced motion preferences)
  - animationDelay: time unit for staggered animations
- **Relationships**: Applied to UI components to control their animation behavior

### Page Transition State
- **Description**: Information about the current page transition state to ensure smooth navigation animations
- **Attributes**:
  - transitionType: string (e.g., "fade", "slide", "none")
  - transitionDuration: time unit
  - isTransitioning: boolean
  - fromPage: string (source page identifier)
  - toPage: string (destination page identifier)
- **Relationships**: Used by layout components to manage page-to-page animations

### Component Animation Properties
- **Description**: Animation properties specific to individual UI components
- **Attributes**:
  - entranceAnimation: string (e.g., "fadeInUp", "slideInLeft", "grow")
  - hoverAnimation: string (e.g., "scale", "glow", "colorShift")
  - animationTrigger: string (e.g., "onLoad", "onScroll", "onHover")
  - animationDelay: time unit for staggered effects
- **Relationships**: Applied to individual UI components like cards, buttons, and text elements

### User Preference Configuration
- **Description**: User preferences that affect animation behavior
- **Attributes**:
  - prefersReducedMotion: boolean (from CSS media query)
  - animationIntensity: number (0-1 scale for animation strength)
  - themePreference: string ("light", "dark", or "system")
- **Relationships**: Used by animation system to adapt behavior based on user preferences

## Entity Relationships

```
User Preference Configuration
        ↓ (influences)
Animation Configuration
        ↓ (controls)
Component Animation Properties
        ↓ (manifests as)
Page Transition State
```

## Validation Rules

1. **Animation Safety**: All animations must gracefully degrade when disabled
2. **Performance**: Animation properties must use hardware-accelerated CSS properties (transform, opacity)
3. **Accessibility**: Animation duration and intensity must respect user preferences
4. **Consistency**: Animation timing and easing must follow established design system patterns
5. **SSR Compatibility**: All animation states must be renderable on server without JavaScript

## State Transitions

### Animation State Transitions
- Idle → Animated (when component enters viewport or loads)
- Animated → Idle (when animation completes)
- Any State → Disabled (when user prefers reduced motion)

### Page Transition State Transitions
- Idle → Transitioning (when navigation begins)
- Transitioning → Idle (when navigation completes)
- Transitioning → Interrupted (when new navigation occurs during transition)