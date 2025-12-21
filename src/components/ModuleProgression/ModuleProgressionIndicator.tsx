import React from 'react';
import Link from '@docusaurus/Link';

interface Module {
  id: string;
  title: string;
  path: string;
  description: string;
  position: number;
}

const modules: Module[] = [
  {
    id: 'robotic-nervous-system',
    title: 'The Robotic Nervous System (ROS 2)',
    path: '/docs/robotic-nervous-system/',
    description: 'Introduction to ROS 2, the middleware framework for robotic applications',
    position: 1
  },
  {
    id: 'digital-twin',
    title: 'The Digital Twin (Gazebo & Unity)',
    path: '/docs/digital-twin/',
    description: 'Simulation environments using Gazebo and Unity for robotics testing',
    position: 2
  },
  {
    id: 'ai-robot-brain',
    title: 'The AI-Robot Brain (NVIDIA Isaac)',
    path: '/docs/ai-robot-brain/',
    description: 'AI-powered perception and control systems using NVIDIA Isaac',
    position: 3
  },
  {
    id: 'vla-capstone',
    title: 'Vision-Language-Action (VLA) + Capstone',
    path: '/docs/vla-capstone/',
    description: 'Advanced integration of vision, language, and action systems',
    position: 4
  }
];

interface ModuleProgressionIndicatorProps {
  currentModuleId?: string;
}

const ModuleProgressionIndicator: React.FC<ModuleProgressionIndicatorProps> = ({
  currentModuleId = 'robotic-nervous-system'
}) => {
  const currentIndex = modules.findIndex(m => m.id === currentModuleId);
  const currentModule = modules[currentIndex];

  return (
    <div className="module-progression-container">
      <h3 className="module-progression-title">Learning Path</h3>
      <p className="module-progression-description">
        Progress through the modules in sequence to build comprehensive knowledge of Physical AI & Humanoid Robotics.
      </p>

      <div className="module-progression-list">
        {modules.map((module, index) => {
          const isCurrent = module.id === currentModuleId;
          const isCompleted = index < currentIndex;
          const isUpcoming = index > currentIndex;
          const isNext = index === currentIndex + 1;

          return (
            <div
              key={module.id}
              className={`module-progression-item ${
                isCurrent ? 'module-progression-item--current' :
                isCompleted ? 'module-progression-item--completed' :
                isUpcoming ? 'module-progression-item--upcoming' : ''
              }`}
            >
              <div className="module-progression-item-header">
                <div className="module-progression-item-status">
                  {isCompleted ? (
                    <span className="module-progression-status-completed">✓</span>
                  ) : isCurrent ? (
                    <span className="module-progression-status-current">●</span>
                  ) : (
                    <span className="module-progression-status-pending">○</span>
                  )}
                </div>

                <div className="module-progression-item-info">
                  <div className="module-progression-item-position">
                    Module {module.position}
                  </div>
                  <Link
                    to={module.path}
                    className={`module-progression-item-title ${
                      isCurrent ? 'module-progression-item-title--current' : ''
                    }`}
                  >
                    {module.title}
                  </Link>
                  <div className="module-progression-item-description">
                    {module.description}
                  </div>
                </div>
              </div>

              {isNext && (
                <div className="module-progression-item-next">
                  <span className="module-progression-next-label">Next:</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModuleProgressionIndicator;