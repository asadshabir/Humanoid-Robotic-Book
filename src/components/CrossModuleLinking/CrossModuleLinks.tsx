import React from 'react';
import Link from '@docusaurus/Link';

interface CrossModuleLink {
  moduleId: string;
  moduleName: string;
  path: string;
  description: string;
  relation: 'prerequisite' | 'continuation' | 'related' | 'reference';
}

interface CrossModuleLinksProps {
  currentModuleId: string;
  currentModuleName: string;
}

const moduleRelations: Record<string, CrossModuleLink[]> = {
  'robotic-nervous-system': [
    {
      moduleId: 'digital-twin',
      moduleName: 'The Digital Twin (Gazebo & Unity)',
      path: '/docs/digital-twin/',
      description: 'Simulate your ROS 2 nodes in realistic environments',
      relation: 'continuation'
    }
  ],
  'digital-twin': [
    {
      moduleId: 'robotic-nervous-system',
      moduleName: 'The Robotic Nervous System (ROS 2)',
      path: '/docs/robotic-nervous-system/',
      description: 'Connect your simulated robots to ROS 2 for control',
      relation: 'prerequisite'
    },
    {
      moduleId: 'ai-robot-brain',
      moduleName: 'The AI-Robot Brain (NVIDIA Isaac)',
      path: '/docs/ai-robot-brain/',
      description: 'Apply AI perception to your simulated robots',
      relation: 'continuation'
    }
  ],
  'ai-robot-brain': [
    {
      moduleId: 'digital-twin',
      moduleName: 'The Digital Twin (Gazebo & Unity)',
      path: '/docs/digital-twin/',
      description: 'Test your AI algorithms in simulation first',
      relation: 'prerequisite'
    },
    {
      moduleId: 'vla-capstone',
      moduleName: 'Vision-Language-Action (VLA) + Capstone',
      path: '/docs/vla-capstone/',
      description: 'Combine AI perception with advanced action systems',
      relation: 'continuation'
    }
  ],
  'vla-capstone': [
    {
      moduleId: 'ai-robot-brain',
      moduleName: 'The AI-Robot Brain (NVIDIA Isaac)',
      path: '/docs/ai-robot-brain/',
      description: 'Foundation for advanced AI-robot integration',
      relation: 'prerequisite'
    },
    {
      moduleId: 'robotic-nervous-system',
      moduleName: 'The Robotic Nervous System (ROS 2)',
      path: '/docs/robotic-nervous-system/',
      description: 'Implementation platform for VLA systems',
      relation: 'reference'
    }
  ]
};

const relationLabels: Record<string, string> = {
  prerequisite: 'Prerequisite',
  continuation: 'Next Step',
  related: 'Related',
  reference: 'Reference'
};

const relationIcons: Record<string, string> = {
  prerequisite: '←',
  continuation: '→',
  related: '◊',
  reference: '†'
};

const CrossModuleLinks: React.FC<CrossModuleLinksProps> = ({
  currentModuleId,
  currentModuleName
}) => {
  const relatedModules = moduleRelations[currentModuleId] || [];

  if (relatedModules.length === 0) {
    return null;
  }

  return (
    <div className="cross-module-links-container">
      <h3 className="cross-module-links-title">Cross-Module Connections</h3>
      <p className="cross-module-links-description">
        Explore related concepts in other modules to deepen your understanding.
      </p>

      <div className="cross-module-links-list">
        {relatedModules.map((module, index) => (
          <div key={index} className="cross-module-link-item">
            <div className="cross-module-link-header">
              <span className={`cross-module-relation cross-module-relation--${module.relation}`}>
                {relationIcons[module.relation]} {relationLabels[module.relation]}
              </span>
            </div>

            <div className="cross-module-link-content">
              <Link
                to={module.path}
                className="cross-module-link-title"
              >
                {module.moduleName}
              </Link>
              <p className="cross-module-link-description">
                {module.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrossModuleLinks;