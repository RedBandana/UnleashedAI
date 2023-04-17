import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "./Message.css";

const Message = ({ message, onDelete }) => {
  const [showOptions, setShowOptions] = useState(false);
  const messageClass = message.isUser ? "chat-message-user" : "chat-message-bot";
  const textClass = message.isUser ? "chat-message-text-user" : "chat-message-text-bot";
  const timestamp = moment(message.timestamp).format("h:mm A");
  const optionsRef = useRef(null);

  const handleOptionsClick = () => {
    setShowOptions(!showOptions);
  };

  const handleDeleteClick = () => {
    onDelete(message);
  };

  const handleClickOutside = (event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`chat-message ${messageClass}`}>
      <div className="chat-message-container">
        <div className={`chat-message-text ${textClass}`}>
          {message.text}
        </div>
        <div className="chat-message-icons-container" onClick={handleOptionsClick} ref={optionsRef}>
          <i className="fa fa-ellipsis-v chat-message-options-icon"></i>
        </div>
      </div>
      
      {showOptions && (
          <div className="chat-message-options-container">
            <button onClick={handleDeleteClick}>
              <i className="fa fa-trash"></i>
            </button>
            <div className="chat-message-timestamp">{timestamp}</div>
          </div>
        )}
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.object.isRequired,
};

export default Message;