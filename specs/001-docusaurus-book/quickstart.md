# Quickstart Guide for Physical AI & Humanoid Robotics Book Development

## Prerequisites

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (or yarn/pnpm equivalent)
- **Git**: Version control system
- **Text Editor**: VS Code or similar with TypeScript/MDX support

## Setup Instructions

### 1. Clone and Initialize Repository
```bash
git clone <repository-url>
cd <repository-name>
npm install
```

### 2. Install Docusaurus Dependencies
```bash
npm install @docusaurus/core@latest @docusaurus/preset-classic@latest @docusaurus/module-type-aliases@latest @docusaurus/types@latest
```

### 3. Create Basic Docusaurus Structure
```bash
npx create-docusaurus@latest website classic --typescript
```

### 4. Start Development Server
```bash
npm run start
```
This will start the development server at `http://localhost:3000`

## Project Structure

```
my-website/
├── docs/                 # Book content organized by modules
│   ├── module-1-ros2/    # The Robotic Nervous System (ROS 2)
│   ├── module-2-digital-twin/ # The Digital Twin (Gazebo & Unity)
│   ├── module-3-ai-brain/ # The AI-Robot Brain (NVIDIA Isaac)
│   └── module-4-vla/     # Vision-Language-Action (VLA) + Capstone
├── src/
│   ├── components/       # Custom React components
│   ├── pages/            # Static pages
│   └── css/              # Custom styles
├── static/               # Static assets (images, URDF files, etc.)
├── docusaurus.config.js  # Site configuration
├── package.json
└── README.md
```

## Creating Content

### Adding a New Chapter
1. Create an MDX file in the appropriate module directory:
   ```
   docs/module-1-ros2/introduction-to-ros2.mdx
   ```

2. Add frontmatter to the file:
   ```md
   ---
   title: Introduction to ROS 2
   sidebar_position: 1
   description: Learn the fundamentals of ROS 2 architecture
   ---
   ```

3. Write your content using MDX syntax, incorporating any custom components as needed.

### Adding Custom Components
1. Create a new component in `src/components/`
2. Import and use in MDX files:
   ```jsx
   import MyComponent from '@site/src/components/MyComponent';

   <MyComponent />
   ```

## Building and Deployment

### Local Build
```bash
npm run build
```
This creates a static build in the `build/` directory.

### Local Serve
```bash
npm run serve
```
Serves the built site locally for testing.

### GitHub Pages Deployment
1. Configure `docusaurus.config.js` with your GitHub Pages settings
2. Set up GitHub Actions workflow for automatic deployment
3. Push changes to main branch to trigger deployment

## SSR Safety Guidelines

When creating custom components, always follow these SSR safety practices:

```jsx
import { useEffect, useState } from 'react';

function MyComponent() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Render fallback during SSR
    return <div>Loading...</div>;
  }

  // Client-side content
  return <div>Client-only content</div>;
}
```

Or use the `ClientOnly` wrapper:

```jsx
import ClientOnly from '@docusaurus/ClientOnly';

function MyComponent() {
  return (
    <ClientOnly>
      {() => {
        // Client-side only code here
        return <div>Client-only content</div>;
      }}
    </ClientOnly>
  );
}
```

## Content Standards

### Academic Integrity
- All technical claims must be verifiable
- Citations must follow APA 7 format
- At least 50% of content should be from peer-reviewed sources

### Accessibility
- All images must have alt text
- Color contrast must meet WCAG AA standards
- Content must be navigable via keyboard

### Performance
- Images should be optimized
- Large assets should be loaded lazily
- Animations must be optional and non-blocking