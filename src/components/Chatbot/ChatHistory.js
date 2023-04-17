import React from 'react';
import PropTypes from 'prop-types';
import Message from '../Message/Message';

function ChatHistory(props) {
  const { messages, onDelete } = props;

  const handleDelete = (message) => {
    onDelete(message);
  };

  return (
    <div className="chatbot-messages">
      {messages.map((message, index) => (
        <Message key={index} message={message} onDelete={handleDelete} />
      ))}
    </div>
  );
}

ChatHistory.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      texts: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
      isUser: PropTypes.bool.isRequired,
    })
  ).isRequired,
};

export default ChatHistory;
