import React from 'react';
import Link from '@docusaurus/Link';

interface DependencyItem {
  id: string;
  title: string;
  path: string;
  description: string;
}

interface DependencyNavigationProps {
  currentModuleId: string;
  prerequisites?: DependencyItem[];
  continuations?: DependencyItem[];
  references?: DependencyItem[];
}

const defaultDependencies: Record<string, DependencyNavigationProps> = {
  'robotic-nervous-system': {
    currentModuleId: 'robotic-nervous-system',
    continuations: [
      {
        id: 'digital-twin',
        title: 'Digital Twin',
        path: '/docs/digital-twin/',
        description: 'Simulate your ROS 2 nodes in realistic environments'
      }
    ],
    references: [
      {
        id: 'ai-robot-brain',
        title: 'AI-Robot Brain',
        path: '/docs/ai-robot-brain/',
        description: 'Apply AI algorithms to your ROS 2 systems'
      }
    ]
  },
  'digital-twin': {
    currentModuleId: 'digital-twin',
    prerequisites: [
      {
        id: 'robotic-nervous-system',
        title: 'Robotic Nervous System',
        path: '/docs/robotic-nervous-system/',
        description: 'Connect your simulated robots to ROS 2 for control'
      }
    ],
    continuations: [
      {
        id: 'ai-robot-brain',
        title: 'AI-Robot Brain',
        path: '/docs/ai-robot-brain/',
        description: 'Apply AI perception to your simulated robots'
      }
    ]
  },
  'ai-robot-brain': {
    currentModuleId: 'ai-robot-brain',
    prerequisites: [
      {
        id: 'digital-twin',
        title: 'Digital Twin',
        path: '/docs/digital-twin/',
        description: 'Test your AI algorithms in simulation first'
      }
    ],
    continuations: [
      {
        id: 'vla-capstone',
        title: 'VLA + Capstone',
        path: '/docs/vla-capstone/',
        description: 'Combine AI perception with advanced action systems'
      }
    ]
  },
  'vla-capstone': {
    currentModuleId: 'vla-capstone',
    prerequisites: [
      {
        id: 'ai-robot-brain',
        title: 'AI-Robot Brain',
        path: '/docs/ai-robot-brain/',
        description: 'Foundation for advanced AI-robot integration'
      }
    ],
    references: [
      {
        id: 'robotic-nervous-system',
        title: 'Robotic Nervous System',
        path: '/docs/robotic-nervous-system/',
        description: 'Implementation platform for VLA systems'
      }
    ]
  }
};

const DependencyNavigation: React.FC<{ currentModuleId: string }> = ({ currentModuleId }) => {
  const dependencies = defaultDependencies[currentModuleId] || {
    currentModuleId,
    prerequisites: [],
    continuations: [],
    references: []
  };

  const hasDependencies =
    (dependencies.prerequisites && dependencies.prerequisites.length > 0) ||
    (dependencies.continuations && dependencies.continuations.length > 0) ||
    (dependencies.references && dependencies.references.length > 0);

  if (!hasDependencies) {
    return null;
  }

  return (
    <div className="dependency-navigation-container">
      <h3 className="dependency-navigation-title">Module Dependencies</h3>

      <div className="dependency-navigation-grid">
        {dependencies.prerequisites && dependencies.prerequisites.length > 0 && (
          <div className="dependency-section">
            <h4 className="dependency-section-title">Prerequisites</h4>
            {dependencies.prerequisites.map((item) => (
              <div key={item.id} className="dependency-navigation-item">
                <div className="dependency-navigation-item-title">
                  <Link to={item.path}>{item.title}</Link>
                </div>
                <div className="dependency-navigation-item-desc">{item.description}</div>
              </div>
            ))}
          </div>
        )}

        {dependencies.continuations && dependencies.continuations.length > 0 && (
          <div className="dependency-section">
            <h4 className="dependency-section-title">Next Steps</h4>
            {dependencies.continuations.map((item) => (
              <div key={item.id} className="dependency-navigation-item">
                <div className="dependency-navigation-item-title">
                  <Link to={item.path}>{item.title}</Link>
                </div>
                <div className="dependency-navigation-item-desc">{item.description}</div>
              </div>
            ))}
          </div>
        )}

        {dependencies.references && dependencies.references.length > 0 && (
          <div className="dependency-section">
            <h4 className="dependency-section-title">References</h4>
            {dependencies.references.map((item) => (
              <div key={item.id} className="dependency-navigation-item">
                <div className="dependency-navigation-item-title">
                  <Link to={item.path}>{item.title}</Link>
                </div>
                <div className="dependency-navigation-item-desc">{item.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DependencyNavigation;