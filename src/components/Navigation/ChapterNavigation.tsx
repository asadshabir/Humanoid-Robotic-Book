import React from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useThemeConfig } from '@docusaurus/theme-common';

interface ChapterNavigationProps {
  chapterTitle?: string;
}

// Define the navigation structure for each module
const navigationStructure = {
  'robotic-nervous-system': [
    { id: 'index', title: 'Module Overview', path: '/docs/robotic-nervous-system/' },
    { id: 'introduction-to-ros2', title: 'Introduction to ROS 2', path: '/docs/robotic-nervous-system/introduction-to-ros2' },
    { id: 'nodes-communication', title: 'Nodes and Communication', path: '/docs/robotic-nervous-system/nodes-communication' },
    { id: 'services-actions', title: 'Services and Actions', path: '/docs/robotic-nervous-system/services-actions' },
  ],
  'digital-twin': [
    { id: 'index', title: 'Module Overview', path: '/docs/digital-twin/' },
    { id: 'gazebo-fundamentals', title: 'Gazebo Fundamentals', path: '/docs/digital-twin/gazebo-fundamentals' },
    { id: 'unity-integration', title: 'Unity Integration', path: '/docs/digital-twin/unity-integration' },
    { id: 'co-simulation', title: 'Co-simulation', path: '/docs/digital-twin/co-simulation' },
  ],
  'ai-robot-brain': [
    { id: 'index', title: 'Module Overview', path: '/docs/ai-robot-brain/' },
    { id: 'isaac-introduction', title: 'Introduction to NVIDIA Isaac', path: '/docs/ai-robot-brain/isaac-introduction' },
    { id: 'perception-pipeline', title: 'Perception Pipeline', path: '/docs/ai-robot-brain/perception-pipeline' },
    { id: 'navigation-control', title: 'Navigation and Control', path: '/docs/ai-robot-brain/navigation-control' },
  ],
  'vla-capstone': [
    { id: 'index', title: 'Module Overview', path: '/docs/vla-capstone/' },
    { id: 'vla-fundamentals', title: 'VLA Fundamentals', path: '/docs/vla-capstone/vla-fundamentals' },
    { id: 'multimodal-integration', title: 'Multimodal Integration', path: '/docs/vla-capstone/multimodal-integration' },
    { id: 'capstone-project', title: 'Capstone Project', path: '/docs/vla-capstone/capstone-project' },
  ],
};

const ChapterNavigation: React.FC<ChapterNavigationProps> = ({ chapterTitle }) => {
  const location = useLocation();
  const { siteConfig } = useDocusaurusContext();
  const themeConfig = useThemeConfig();

  // Extract module and chapter from the current path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const moduleIndex = pathParts.indexOf('docs') + 1;
  const moduleId = pathParts[moduleIndex];
  const chapterId = pathParts[moduleIndex + 1]?.replace('.html', '') || 'index';

  // Get the navigation structure for the current module
  const moduleStructure = navigationStructure[moduleId as keyof typeof navigationStructure];

  if (!moduleStructure) {
    return null; // Don't show navigation if not in a known module
  }

  // Find the current chapter's position
  const currentIndex = moduleStructure.findIndex(item => item.id === chapterId);
  if (currentIndex === -1) {
    return null; // Current page not in navigation structure
  }

  const previousChapter = currentIndex > 0 ? moduleStructure[currentIndex - 1] : null;
  const nextChapter = currentIndex < moduleStructure.length - 1 ? moduleStructure[currentIndex + 1] : null;

  return (
    <nav className="chapter-navigation" aria-label="Chapter navigation">
      <div className="chapter-navigation-container">
        {previousChapter ? (
          <Link
            to={previousChapter.path}
            className="chapter-navigation-link chapter-navigation-link--previous"
            aria-label={`Previous chapter: ${previousChapter.title}`}
          >
            <span className="chapter-navigation-arrow">←</span>
            <div className="chapter-navigation-info">
              <div className="chapter-navigation-direction">Previous</div>
              <div className="chapter-navigation-title">{previousChapter.title}</div>
            </div>
          </Link>
        ) : (
          <div className="chapter-navigation-placeholder"></div>
        )}

        {nextChapter && (
          <Link
            to={nextChapter.path}
            className="chapter-navigation-link chapter-navigation-link--next"
            aria-label={`Next chapter: ${nextChapter.title}`}
          >
            <div className="chapter-navigation-info">
              <div className="chapter-navigation-direction">Next</div>
              <div className="chapter-navigation-title">{nextChapter.title}</div>
            </div>
            <span className="chapter-navigation-arrow">→</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default ChapterNavigation;