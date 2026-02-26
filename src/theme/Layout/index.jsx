import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import { ChatbotProvider } from '@site/src/contexts/ChatbotContext';
import Chatbot from '@site/src/components/Chatbot';
import FloatingChatbotButton from '@site/src/components/Chatbot/FloatingChatbotButton';
import { useChatbot } from '@site/src/contexts/ChatbotContext';
import styles from './Layout.module.css';

// Component to handle the floating button and chatbot integration
const ChatbotIntegration = () => {
  const { isOpen, toggleChatbot, hasUnreadMessages } = useChatbot();

  return (
    <>
      {/* Only show floating button when chatbot is closed */}
      {!isOpen && (
        <FloatingChatbotButton
          isOpen={isOpen}
          onToggle={toggleChatbot}
          hasUnreadMessages={hasUnreadMessages}
        />
      )}
      {isOpen && (
        <div className={styles.chatbotOverlay} onClick={(e) => {
          // Close chatbot when clicking overlay background
          if (e.target === e.currentTarget) {
            toggleChatbot();
          }
        }}>
          <div className={styles.chatbotContainer}>
            {/* Close button for mobile */}
            <button
              className={styles.closeButton}
              onClick={toggleChatbot}
              aria-label="Close chatbot"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <Chatbot />
          </div>
        </div>
      )}
    </>
  );
};

// Wrapper component that provides chatbot context
const ChatbotLayout = (props) => {
  return (
    <ChatbotProvider>
      <OriginalLayout {...props} />
      <ChatbotIntegration />
    </ChatbotProvider>
  );
};

export default ChatbotLayout;