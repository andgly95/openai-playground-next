import React, { useState } from 'react';

const ChatSection = () => {
  const [messages, setMessages] = useState([]);

  const handleClearConversation = () => {
    setMessages([]);
  };

  return (
    <div className="chat-section">
      {/* Existing chat messages will be displayed here */}
      <div className="messages-list">
        {messages.map((message, index) => (
          <div key={index} className="message">
            {message}
          </div>
        ))}
      </div>
      {/* Add new button to clear conversation */}
      <button
        className="clear-conversation-button"
        onClick={handleClearConversation}
        disabled={messages.length === 0}
      >
        Clear Conversation
      </button>
    </div>
  );
};

export default ChatSection;