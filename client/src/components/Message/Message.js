import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import PropTypes from "prop-types";
import moment from "moment";
import "./Message.scss";
import { Clipboard } from '@capacitor/clipboard';
import remarkGfm from "remark-gfm";
import Prism from 'prismjs';
import 'prism-themes/themes/prism-vsc-dark-plus.css'; // Import Prism's default styles

// Import language support for desired programming languages
import 'prismjs/components/prism-basic';
import 'prismjs/components/prism-batch';
import 'prismjs/components/prism-csv';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-dart';
import 'prismjs/components/prism-git';
import 'prismjs/components/prism-http';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-mongodb';
import 'prismjs/components/prism-pascal';
import 'prismjs/components/prism-powershell';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-regex';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-uri';
import 'prismjs/components/prism-yaml';

const Message = ({ message, onDelete, index }) => {
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
    onDelete(index);
    setShowOptions(false);
  };

  const handleCopyClick = async () => {
    await Clipboard.write({
      string: message.texts[currentTextIndex]
    });
    setShowOptions(false);
  }

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
    // Call Prism.highlightAll() after rendering the Markdown content
    Prism.highlightAll();

    const chatMessage = document.getElementById(`chat-message-${index}`);
    const preElements = chatMessage.querySelectorAll('pre');
    if (preElements) {
      preElements.forEach((preElement) => {
        if (preElement.querySelector('code')) {
          if (!preElement.className.includes('language')) {
            preElement.classList.add('language-none');
          }

          //Todo Add Copy and Language
        }
      });
    }

    const lists = chatMessage.querySelectorAll('ol, ul');
    if (lists) {
      lists.forEach((list) => {
        list.classList.add('markdown-list');
      });
    }
  }, [index, message])

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
          <div className="chat-message-text" id={`chat-message-${index}`}>
            <ReactMarkdown children={message.texts[currentTextIndex]} remarkPlugins={[remarkGfm]} />
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
          <button onClick={handleCopyClick}>
            <i className="fa fas fa-clipboard"></i>
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