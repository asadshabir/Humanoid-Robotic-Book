import React from 'react';
import styles from './Chatbot.module.css';

const ChatMessage = ({ message }) => {
  const { sender, content, sources, isError, isLoading, id } = message;

  // Determine if this is a loading message
  const isAgentLoading = isLoading && sender === 'agent';

  return (
    <div
      className={`${styles.chatMessage} ${styles[`${sender}Message`]}`}
      key={id}
    >
      <div className={styles.messageContent}>
        {isAgentLoading ? (
          <div className={styles.loadingIndicator}>
            <span>Thinking</span>
            <span className={styles.loadingDots}>...</span>
          </div>
        ) : (
          <>
            <p>{content}</p>
            {sources && sources.length > 0 && (
              <div className={styles.sources}>
                <h4>Sources:</h4>
                <ul>
                  {sources.map((source, index) => (
                    <li key={index}>{source}</li>
                  ))}
                </ul>
              </div>
            )}
            {isError && (
              <div className={styles.errorMessage}>
                ⚠️ {content || 'An error occurred. Please try again.'}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;