import React from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';

interface ModuleSidebarProps {
  moduleId: string;
  moduleName: string;
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

const ModuleSidebar: React.FC<ModuleSidebarProps> = ({ moduleId, moduleName }) => {
  const location = useLocation();
  const moduleStructure = navigationStructure[moduleId as keyof typeof navigationStructure];

  if (!moduleStructure) {
    return null;
  }

  return (
    <aside className="module-sidebar" aria-label={`Navigation for ${moduleName}`}>
      <div className="module-sidebar-header">
        <h3 className="module-sidebar-title">{moduleName}</h3>
      </div>

      <nav className="module-sidebar-nav">
        <ul className="module-sidebar-list">
          {moduleStructure.map((chapter) => {
            const isActive = location.pathname === chapter.path ||
                           (location.pathname === chapter.path + 'index.html');

            return (
              <li key={chapter.id} className="module-sidebar-item">
                <Link
                  to={chapter.path}
                  className={`module-sidebar-link ${
                    isActive ? 'module-sidebar-link--active' : ''
                  }`}
                >
                  {chapter.title}
                  {isActive && (
                    <span className="module-sidebar-active-marker" aria-hidden="true"></span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default ModuleSidebar;