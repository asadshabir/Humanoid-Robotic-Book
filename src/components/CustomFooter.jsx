import React from 'react';
import { useThemeConfig } from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import RobotIcon, { RoboticIcons } from './Icon/RobotIcon';

const CustomFooter = () => {
  const themeConfig = useThemeConfig();
  const { footer } = themeConfig;

  if (!footer) {
    return null;
  }

  const { links = [], copyright } = footer;

  return (
    <footer className="footer">
      <div className="container">
        {links && links.length > 0 && (
          <div className="row footer__links">
            {links.map((linkSection, i) => (
              <div key={i} className="col footer__col">
                {linkSection.title != null ? (
                  <h4 className="footer__title">{linkSection.title}</h4>
                ) : null}
                {linkSection.items != null &&
                Array.isArray(linkSection.items) &&
                linkSection.items.length > 0 ? (
                  <ul className="footer__items">
                    {linkSection.items.map((item, j) => (
                      <li key={j} className="footer__item">
                        {item.to ? (
                          <Link
                            to={item.to}
                            className="footer__link"
                            target={item.target}
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <a
                            href={item.href}
                            className="footer__link"
                            target={item.target || '_blank'}
                            rel={item.rel || 'noopener noreferrer'}
                          >
                            {item.label}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        )}

        <div className="footer__bottom">
          <div className="footer__bottom--container">
            <div className="footer__robot-animation">
              <RobotIcon
                icon={RoboticIcons.robot}
                size="1.5em"
                className="footer-robot-icon animated float"
                animated={true}
              />
            </div>
            <div className="footer__copyright">
              {copyright}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CustomFooter;