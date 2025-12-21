import React from 'react';
import clsx from 'clsx';
import { useLocation } from '@docusaurus/router';
import { PageMetadata, useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { ThemeClassNames } from '@docusaurus/theme-common';
import type { FooterProps } from '@theme/Footer';
import styles from './Footer.module.css';

const socialLinks = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/asad-shabir-programmer110/',
    icon: '💼',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/asadshabir/',
    icon: '🐙',
  },
  {
    name: 'Portfolio',
    url: 'https://asadshabir.netlify.app/',
    icon: '🌐',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/Asadalibhatti110',
    icon: '📘',
  },
];

const Footer: React.FC<FooterProps> = ({}) => {
  const { siteConfig } = useDocusaurusContext();
  const { pathname } = useLocation();
  const { withBaseUrl } = useBaseUrlUtils();

  // Don't show footer on 404 page
  if (pathname === '/404') {
    return null;
  }

  return (
    <footer
      className={clsx(ThemeClassNames.common.footer, 'footer')}
      itemScope
      itemType="http://schema.org/Organization"
    >
      <div className="container container-fluid">
        <div className="footer__top-section">
          <div className="row">
            {/* Left section with site title and description */}
            <div className="col col--4">
              <div className="footer__about">
                <h2 className="footer__title">{siteConfig.title}</h2>
                <p className="footer__description">{siteConfig.tagline}</p>
              </div>
            </div>

            {/* Middle section with links */}
            <div className="col col--4">
              <div className="footer__links">
                <h3 className="footer__section-title">Resources</h3>
                <ul className="footer__items">
                  <li className="footer__item">
                    <Link to={withBaseUrl('/docs/intro')} className="footer__link-item fade-in">
                      Getting Started
                    </Link>
                  </li>
                  <li className="footer__item">
                    <Link to={withBaseUrl('/docs/robotic-nervous-system')} className="footer__link-item fade-in delay-1">
                      Core Concepts
                    </Link>
                  </li>
                  <li className="footer__item">
                    <Link to={withBaseUrl('/docs/')} className="footer__link-item fade-in delay-2">
                      Documentation
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right section with social links */}
            <div className="col col--4">
              <div className="footer__social">
                <h3 className="footer__section-title">Connect</h3>
                <div className="footer__social-links">
                  {socialLinks.map((social, index) => (
                    <Link
                      key={social.name}
                      href={social.url}
                      className={clsx('footer__social-link', 'hover-scale', `delay-${index}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow us on ${social.name}`}
                    >
                      <span className="footer__social-icon">{social.icon}</span>
                      <span className="footer__social-name">{social.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="footer__bottom-section">
          <div className="row">
            <div className="col col--12">
              <div className="footer__bottom">
                <p className="footer__copyright">
                  © {new Date().getFullYear()} Physical AI & Humanoid Robotics Book. All rights reserved.
                </p>
                <div className="footer__legal">
                  <Link to={withBaseUrl('/docs/intro')} className="footer__legal-link fade-in">
                    Getting Started
                  </Link>
                  <Link to={withBaseUrl('/docs')} className="footer__legal-link fade-in delay-1">
                    Documentation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;