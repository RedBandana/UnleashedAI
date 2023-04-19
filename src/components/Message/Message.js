import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "./Message.scss";

const Message = ({ message, onDelete }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const messageClass = message.isUser ? "chat-message-user" : "chat-message-bot";
  const textClass = message.isUser ? "chat-message-text-user" : "chat-message-text-bot";
  const timestamp = moment(message.timestamp).format("h:mm A");
  const optionsRef = useRef(null);

  const handleOptionsClick = () => {
    setShowOptions(!showOptions);
  };

  const handleDeleteClick = () => {
    onDelete(message);
    setShowOptions(false);
  };

  const handleClickOutside = (event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target) 
        && event.target.className !== "chat-message-options-container") {
      setShowOptions(false);
    }
  };

  const handlePrevClick = () => {
    setCurrentTextIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextClick = () => {
    setCurrentTextIndex((prevIndex) => Math.min(prevIndex + 1, message.texts.length - 1));
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
        <div className={`chat-message-bubble ${textClass}`}>
          <div className="chat-message-text">
            {message.texts[currentTextIndex]}
          </div>
          {message.texts.length > 1 && (
            <div className={`chat-message-controls-container ${textClass}`}>
              <button className="chat-message-control" onClick={handlePrevClick} disabled={currentTextIndex === 0}>
                <i className="fa fa-chevron-left"></i>
              </button>
              <div className="chat-message-dots-container">
                {message.texts.map((text, index) => (
                  <div
                    key={index}
                    className={`chat-message-dot ${index === currentTextIndex ? "chat-message-dot-active" : ""}`}
                  ></div>
                ))}
              </div>
              <button
                className="chat-message-control"
                onClick={handleNextClick}
                disabled={currentTextIndex === message.texts.length - 1}
              >
                <i className="fa fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
        <div className="chat-message-icons-container" onClick={handleOptionsClick} ref={optionsRef}>
          <i className="fa fa-ellipsis-v chat-message-options-icon"></i>
        </div>
      </div>

      {showOptions && (
        <div className="chat-message-options-container" ref={optionsRef}>
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
  message: PropTypes.shape({
    texts: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    isUser: PropTypes.bool.isRequired,
    timestamp: PropTypes.number.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Message;