import React from 'react';
import clsx from 'clsx';
import styles from '../../pages/index.module.css';

const AuthorSection: React.FC = () => {
  return (
    <section className={clsx(styles.authorSection, 'fade-in-up')}>
      <div className={styles.authorContainer}>
        <div className={clsx(styles.authorImageContainer, 'animated', 'float')}>
          <img
            src="/img/hero/creator-profile.png"
            alt="Asad Shabir - Creator of Physical AI & Humanoid Robotics"
            className={styles.authorImage}
            loading="lazy"
          />
        </div>
        <div className={clsx(styles.authorContent, 'animated', 'delay-1')}>
          <h2 className="fade-in-up">About the Author</h2>
          <h3 className="fade-in-up delay-1">Asad Shabir</h3>
          <p className="fade-in-up delay-2">
            Asad Shabir is a certified <strong>AI & Automation Engineer</strong> and <strong>Python Developer</strong> based in Karachi, Pakistan. With over three years of hands-on coding experience, he specializes in building intelligent, scalable systems using modern AI and automation technologies.
          </p>
          <p className="fade-in-up delay-3">
            His work focuses on practical AI applications, automation workflows, and intelligent assistants that solve real-world problems. He actively builds AI agents, automation pipelines, and custom chatbots for productivity, research, and business use cases.
          </p>
          <div className={clsx(styles.authorCredentials, 'fade-in-up delay-4')}>
            <div className={styles.credentialItem}>
              <strong>AI Agent Development</strong>
              <span>Designing and deploying intelligent AI-powered agents using OpenAI Agents SDK and MCP-based architectures for research, automation, and knowledge retrieval.</span>
            </div>
            <div className={styles.credentialItem}>
              <strong>Workflow Automation</strong>
              <span>Building end-to-end automation workflows using <strong>n8n</strong> to eliminate repetitive tasks, optimize operations, and increase efficiency.</span>
            </div>
            <div className={styles.credentialItem}>
              <strong>Custom Chatbots</strong>
              <span>Developing tailored chatbots for customer support, lead generation, and multi-channel communication including Email and WhatsApp.</span>
            </div>
          </div>

          <h3 className="fade-in-up delay-5">Technical Stack</h3>
          <div className="fade-in-up delay-6">
            <span className="badge badge--secondary">Python</span>
            <span className="badge badge--secondary">OpenAI Agents SDK</span>
            <span className="badge badge--secondary">MCP Servers</span>
            <span className="badge badge--secondary">n8n Automation</span>
            <span className="badge badge--secondary">Chainlit UI</span>
            <span className="badge badge--secondary">SQLite</span>
            <span className="badge badge--secondary">Docker (learning)</span>
            <span className="badge badge--secondary">Kubernetes (learning)</span>
          </div>

          <h3 className="fade-in-up delay-7">Key Achievements</h3>
          <div className={clsx(styles.authorCredentials, 'fade-in-up delay-8')}>
            <div className={styles.credentialItem}>
              <strong>Pocket Buddy AI Assistant</strong>
              <span>Built a multi-functional personal AI assistant with voice interaction, reminders, and web search capabilities.</span>
            </div>
            <div className={styles.credentialItem}>
              <strong>Business Automation Systems</strong>
              <span>Designed automation systems that reduced human support workload through 24/7 AI-driven responses and content automation.</span>
            </div>
            <div className={styles.credentialItem}>
              <strong>Certified Professional</strong>
              <span>Currently completing the <strong>Governor Initiative (GIAIC)</strong> certification in <strong>AI, Web 3.0, and Metaverse</strong>.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthorSection;