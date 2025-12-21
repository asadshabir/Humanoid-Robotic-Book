import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useTheme } from '@site/src/theme/ThemeContext';

const Header = () => {
  const { siteConfig } = useDocusaurusContext();
  const { isDarkMode, toggleColorMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="navbar navbar--fixed-top">
      <div className="navbar__inner">
        <div className="navbar__items">
          <Link className="navbar__brand" to="/">
            <strong className="navbar__title">{siteConfig.title}</strong>
          </Link>
        </div>

        <div className="navbar__items navbar__items--right">
          <Link className="navbar__item navbar__link" to="/docs/">
            Modules
          </Link>
          <Link
            className="navbar__item navbar__link"
            to="https://github.com/asadshabir/Humanoid-Robotic-Book"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>

          {/* Theme toggle button */}
          <button
            className="navbar__item navbar__link theme-toggle-button"
            onClick={toggleColorMode}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="navbar__items navbar__items--right mobile-only">
          <button
            className="navbar__toggle clean-btn"
            type="button"
            onClick={toggleMenu}
            aria-label="Toggle navigation bar"
          >
            <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="2"
                d="M4 7h22M4 15h22M4 23h22"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="navbar__sidebar">
          <nav className="navbar__sidebar__items">
            <div className="navbar__sidebar__item">
              <Link className="navbar__item navbar__link" to="/docs/">
                Modules
              </Link>
            </div>
            <div className="navbar__sidebar__item">
              <Link
                className="navbar__item navbar__link"
                to="https://github.com/asadshabir/Humanoid-Robotic-Book"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Link>
            </div>
            <div className="navbar__sidebar__item">
              <button
                className="navbar__item navbar__link theme-toggle-button"
                onClick={toggleColorMode}
              >
                Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;