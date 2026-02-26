import React, { useState } from 'react';
import styles from './Chatbot.module.css';

const ChatInput = ({ onSend, disabled = false }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSend(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !disabled) {
        onSend(inputValue.trim());
        setInputValue('');
      }
    }
  };

  return (
    <form className={styles.chatInputForm} onSubmit={handleSubmit}>
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a question about the book content..."
        className={styles.chatInput}
        disabled={disabled}
        rows={1}
        aria-label="Type your question here"
      />
      <button
        type="submit"
        className={styles.sendButton}
        disabled={!inputValue.trim() || disabled}
        aria-label="Send message"
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;