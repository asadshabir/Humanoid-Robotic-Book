import React from 'react';
import Layout from '@theme/Layout';
import Chatbot from '../components/Chatbot/Chatbot';

function ChatbotPage(): JSX.Element {
  return (
    <Layout title="Book Assistant" description="Chat with the Physical AI & Humanoid Robotics book assistant">
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1>Book Assistant</h1>
          <p>Ask questions about Physical AI & Humanoid Robotics</p>
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
          <Chatbot />
        </div>
      </main>
    </Layout>
  );
}

export default ChatbotPage;