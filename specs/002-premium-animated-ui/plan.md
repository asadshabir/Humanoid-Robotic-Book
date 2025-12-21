# Premium Animated UI Implementation Plan

## Technical Context

- **Project**: Physical AI & Humanoid Robotics book
- **Framework**: Docusaurus v3.x
- **Current homepage**: Implemented as `src/pages/index.tsx` with custom styling
- **Current styling**: `src/css/custom.css` with professional academic color system
- **Deployment**: GitHub Pages
- **Reference image**: `static/img/hero/book-cover.png` (contains dark futuristic academic theme)

## Constitution Check

- ✅ CSS-only animations required (no JavaScript animation libraries)
- ✅ SSR-safe implementation required
- ✅ Responsive design (mobile-first)
- ✅ Accessibility compliance (reduced motion support)
- ✅ GitHub Pages compatibility
- ✅ Dark-mode first design approach

## Gates

- ✅ All animations must be CSS-only
- ✅ All components must be SSR-safe
- ✅ Animations must respect user's reduced motion preferences
- ✅ Performance: animations must run at 60fps
- ✅ Docusaurus v3 compatibility

## Phase 0: Research Findings

### Decision: Animation Approach
- **Rationale**: Using pure CSS animations for compatibility and performance
- **Alternative considered**: CSS-in-JS libraries, JavaScript animation libraries
- **Chosen approach**: Pure CSS animations with transforms and opacity changes for best performance

### Decision: Animation Types
- **Rationale**: Subtle animations that enhance UX without distraction
- **Animation types**: Fade-in effects, slide-in effects, hover transitions, page transitions
- **Performance consideration**: Using transform and opacity for hardware acceleration

### Decision: Animation Control
- **Rationale**: Must respect user preferences for accessibility
- **Implementation**: Using `@media (prefers-reduced-motion: reduce)` media query
- **Fallback**: All animations disabled when user prefers reduced motion

## Phase 1: Implementation Plan

### 1. homepage_components
- **HeroSection animations**: Fade-in and slide-up effects for content, subtle image reveal
- **CoreModulesSection animations**: Staggered fade-in for each module card
- **CTAButtons**: Hover animations with subtle scale and color transitions

### 2. asset_plan
- **No new assets required**: Using existing book-cover image with CSS animations
- **Optimized for SSR**: All animations are CSS-based, no JavaScript required for basic functionality

### 3. styling_plan
- **Animation CSS variables**: Duration, easing, and delay values for consistency
- **Keyframe animations**: Defined in CSS for reusable animation patterns
- **Hover effects**: Subtle transitions for interactive elements
- **Scroll-triggered animations**: Using CSS and minimal JavaScript for SSR compatibility

### 4. risks_and_mitigations
- **Performance issues**: Use hardware-accelerated properties (transform, opacity)
- **Browser compatibility**: Fallback to non-animated state for older browsers
- **Reduced motion compliance**: Use media query to disable animations when requested

### 5. verification_steps
- **npm start**: Verify development server works with animations
- **npm run build**: Verify production build completes with animations
- **Browser testing**: Test in multiple browsers to ensure compatibility
- **Performance testing**: Verify animations run smoothly (60fps)

## Critical Files to be Modified

1. `src/pages/index.tsx` - Add animation classes to homepage elements
2. `src/css/custom.css` - Add animation keyframes and CSS animation properties
3. `src/theme/Footer/index.tsx` - Add hover animations to social icons
4. `src/theme/DocItem/*` - Add reading page micro-interactions
5. `src/components/Homepage/*` - Add animation classes to existing components