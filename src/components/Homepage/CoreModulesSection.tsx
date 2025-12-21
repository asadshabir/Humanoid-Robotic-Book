import React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from '../../pages/index.module.css';

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
}

const CoreModulesSection: React.FC = () => {
  const modules: Module[] = [
    {
      id: 'robotic-nervous-system',
      title: 'The Robotic Nervous System (ROS 2)',
      description: 'Introduction to ROS 2 architecture, node communication patterns, and services and actions implementation.',
      icon: '🤖', // Using emoji as icon, can be replaced with SVG later
      link: '/docs/robotic-nervous-system/'
    },
    {
      id: 'digital-twin',
      title: 'The Digital Twin (Gazebo & Unity)',
      description: 'Gazebo simulation fundamentals, Unity integration for advanced visualization, and co-simulation techniques.',
      icon: '🎮', // Using emoji as icon, can be replaced with SVG later
      link: '/docs/digital-twin/'
    },
    {
      id: 'ai-robot-brain',
      title: 'The AI-Robot Brain (NVIDIA Isaac)',
      description: 'Perception pipeline development, navigation and control systems, and Isaac AI integration.',
      icon: '🧠', // Using emoji as icon, can be replaced with SVG later
      link: '/docs/ai-robot-brain/'
    },
    {
      id: 'vla-capstone',
      title: 'Vision-Language-Action (VLA) + Capstone',
      description: 'Multimodal integration, capstone project implementation, and advanced VLA systems.',
      icon: '🔬', // Using emoji as icon, can be replaced with SVG later
      link: '/docs/vla-capstone/'
    }
  ];

  return (
    <section className={styles.modulesSection}>
      <div className={styles.modulesContainer}>
        <h2>Core Modules</h2>
        <p>Progressive learning path from fundamentals to advanced implementations</p>

        <div className={styles.modulesGrid}>
          {modules.map((module) => (
            <Link
              to={module.link}
              key={module.id}
              className={styles.moduleCard}
            >
              <h3>
                <span className={styles.moduleIcon}>{module.icon}</span>
                {module.title}
              </h3>
              <p>{module.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreModulesSection;