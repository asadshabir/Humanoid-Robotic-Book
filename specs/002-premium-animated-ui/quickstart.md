# Quickstart Guide: Premium Animated UI

## Overview
This guide provides instructions for implementing and customizing the premium animated UI for the Physical AI & Humanoid Robotics book website.

## Prerequisites
- Node.js 18+ installed
- Docusaurus 3.x project set up
- Basic understanding of CSS and React components

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm start
```

## Key Features

### Landing Page Animations
- Hero section fade-in with staggered text animation
- Image reveal effect for book cover
- Button hover animations with subtle scale and color transitions

### Reading Page Interactions
- Smooth page transition effects
- Subtle hover animations for links and interactive elements
- Scroll-triggered content animations

### Footer Animations
- Social media icon hover effects
- Smooth color transitions

## Customization Options

### Animation Timing
Adjust animation speed by modifying CSS variables in `src/css/custom.css`:
```css
:root {
  --ifm-animation-duration-fast: 0.2s;
  --ifm-animation-duration-normal: 0.3s;
  --ifm-animation-duration-slow: 0.5s;
}
```

### Animation Types
Change animation styles by modifying keyframes in `src/css/custom.css`:
- `fadeInUp`: For content sections
- `slideInLeft`: For hero content
- `float`: For image elements
- `scale`: For hover effects

### Color Scheme
Customize animation colors by updating the premium landing page CSS variables:
```css
--ifm-color-landing-accent: #22D3EE; /* Cyan accent */
```

## Accessibility Features
- All animations respect user's "prefers-reduced-motion" setting
- Animations are disabled automatically when reduced motion is preferred
- High contrast options maintained during animations

## Performance Tips
- Use hardware-accelerated properties (transform, opacity)
- Limit animation complexity to maintain 60fps
- Test animations on lower-end devices
- Ensure all content is accessible without animations

## Troubleshooting

### Animations Not Working
1. Check that CSS classes are properly applied
2. Verify CSS file is loaded in `docusaurus.config.js`
3. Ensure no conflicting styles override animations

### Performance Issues
1. Reduce animation complexity
2. Limit simultaneous animations
3. Use `transform` and `opacity` instead of layout properties

### SSR Issues
1. Ensure all animations are CSS-only
2. Verify components render properly without JavaScript
3. Check that animation classes don't break layout when disabled