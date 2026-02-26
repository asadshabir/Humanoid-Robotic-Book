import React, { useState, useEffect } from 'react';
import styles from './FloatingChatbotButton.module.css';

const FloatingChatbotButton = ({ isOpen, onToggle, hasUnreadMessages = false }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll to hide/show button on mobile
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide button when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <button
      className={`${styles.floatingButton} ${isOpen ? styles.open : ''} ${!isVisible ? styles.hidden : ''} ${hasUnreadMessages ? styles.hasUnread : ''}`}
      onClick={onToggle}
      aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
      title={isOpen ? 'Close chatbot' : 'Open chatbot'}
    >
      {hasUnreadMessages && <div className={styles.notificationBadge} />}
      <div className={styles.buttonContent}>
        <div className={`${styles.iconWrapper} ${isOpen ? styles.hiddenIcon : ''}`}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Cartoon Robot Head */}
            <rect x="4" y="6" width="16" height="12" rx="4" stroke="currentColor" strokeWidth="2.5" fill="rgba(255,255,255,0.1)"/>
            {/* Antenna */}
            <path d="M12 6V3M12 3C11 3 11 2 12 2C13 2 13 3 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            {/* Eyes */}
            <circle cx="9" cy="12" r="1.5" fill="currentColor">
              <animate attributeName="r" values="1.5;0.5;1.5" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="15" cy="12" r="1.5" fill="currentColor">
              <animate attributeName="r" values="1.5;0.5;1.5" dur="3s" repeatCount="indefinite" />
            </circle>
            {/* Mouth */}
            <path d="M9 15.5C10 16 14 16 15 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className={`${styles.iconWrapper} ${!isOpen ? styles.hiddenIcon : ''}`}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {/* Hover Morphing State */}
        <div className={styles.hoverBackground} />
      </div>
    </button>
  );
};

export default FloatingChatbotButton;