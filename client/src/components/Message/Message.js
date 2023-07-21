import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
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
import { fixHtmlMarkdown } from "../../utils/functions";

const Message = ({ index, id, message, onDelete, onSelectChoice, onRender, shouldRender }) => {

  const [showOptions, setShowOptions] = useState(false);
  const messageClass = message.isUser ? "chat-message-user" : "chat-message-bot";
  const textClass = message.isUser ? "chat-message-text-user" : "chat-message-text-bot";
  const timestamp = moment(message.createdOn).format("h:mm A");
  const optionsRef = useRef(null);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (shouldRender) {
      const chatMessage = document.getElementById(`chat-message-${message.id}`);
      fixHtmlMarkdown(Prism, [chatMessage])
    }

    onRender(index);
  }, [message]);

  function handleOptionsClick() {
    setShowOptions(!showOptions);
  };

  function handleDeleteClick() {
    onDelete(id);
    setShowOptions(false);
    setHide(true);
  };

  async function handleCopyClick() {
    await Clipboard.write({ string: message.content });
    setShowOptions(false);
  }

  function handleClickOutside(event) {
    if (optionsRef.current && !optionsRef.current.contains(event.target)
      && event.target.className !== "chat-message-options-container") {
      setShowOptions(false);
    }
  };

  function handlePrevClick() {
    trySendSelectChoice(message.choiceIndex - 1);
  };

  function handleNextClick() {
    trySendSelectChoice(message.choiceIndex + 1);
  };

  function trySendSelectChoice(choiceIndex) {
    if (choiceIndex >= 0 && choiceIndex < message.choiceCount) {
      onSelectChoice(message.id, choiceIndex);
    }
  }

  if (hide) {
    return null;
  }

  return (
    <div className={`chat-message ${messageClass}`}>
      <div className={`chat-message-container ${textClass}`}>
        <div className={`chat-message-bubble ${textClass}`}>
          <div className="chat-message-text" id={`chat-message-${message.id}`}>
            <ReactMarkdown children={message.content} remarkPlugins={[remarkGfm]} />
          </div>
          {message.choiceCount > 1 && (
            <div className={`chat-message-controls-container ${textClass}`}>
              <button
                className={`chat-message-control ${message.choiceIndex === 0 ? "chat-message-control-inactive" : ""}`}
                onClick={handlePrevClick}>
                <i className="fa fa-chevron-left"></i>
              </button>
              <div className="chat-message-dots-container">
                {
                  (() => {
                    const dots = [];
                    for (let i = 0; i < message.choiceCount; i++) {
                      dots.push(
                        <div
                          key={i}
                          className={`chat-message-dot ${i === message.choiceIndex ? "chat-message-dot-active" : ""}`}
                        ></div>
                      );
                    }
                    return dots;
                  })()
                }
              </div>
              <button
                className={`chat-message-control ${message.choiceIndex === message.choiceCount - 1 ? "chat-message-control-inactive" : ""}`}
                onClick={handleNextClick}
              >
                <i className="fa fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
        <div className="chat-message-icons-container" onClick={handleOptionsClick} ref={optionsRef}>
          <i className="fa fa-ellipsis-v chat-message-options-icon"></i>
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
      </div>
    </div>
  );
};

export default Message;