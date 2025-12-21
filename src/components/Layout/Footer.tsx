import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const Footer = () => {
  const { siteConfig } = useDocusaurusContext();

  return (
    <footer className="footer">
      <div className="container container--fluid">
        <div className="footer__section">
          <h3 className="footer__title">{siteConfig.title}</h3>
          <p className="footer__description">
            Premium Technical Book on Advanced Robotics, AI, and Physical Intelligence
          </p>
        </div>

        <div className="footer__section">
          <h4 className="footer__title">Documentation</h4>
          <ul className="footer__items">
            <li className="footer__item">
              <Link to="/docs/" className="footer__link">
                Book Overview
              </Link>
            </li>
            <li className="footer__item">
              <Link to="/docs/robotic-nervous-system/" className="footer__link">
                Robotic Nervous System (ROS 2)
              </Link>
            </li>
            <li className="footer__item">
              <Link to="/docs/digital-twin/" className="footer__link">
                Digital Twin (Gazebo & Unity)
              </Link>
            </li>
            <li className="footer__item">
              <Link to="/docs/ai-robot-brain/" className="footer__link">
                AI-Robot Brain (NVIDIA Isaac)
              </Link>
            </li>
            <li className="footer__item">
              <Link to="/docs/vla-capstone/" className="footer__link">
                Vision-Language-Action (VLA) + Capstone
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer__section">
          <h4 className="footer__title">Resources</h4>
          <ul className="footer__items">
            <li className="footer__item">
              <Link
                to="https://github.com/asadshabir/Humanoid-Robotic-Book"
                className="footer__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Repository
              </Link>
            </li>
            <li className="footer__item">
              <Link
                to="https://github.com/asadshabir/Humanoid-Robotic-Book/issues"
                className="footer__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Issue Tracker
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container container--fluid footer__bottom--container">
          <p className="footer__copyright">
            {siteConfig.themeConfig.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;