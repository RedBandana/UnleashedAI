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
import { useDispatch, useSelector } from "react-redux";
import { setReply } from "../../redux/actions/uiActions";
import { REPLY_TEXT_MAX_LENGTH } from "../../utils/constants";

const Message = ({ index, message, onDelete, onSelectChoice, onRender, shouldRender }) => {

  const dispatch = useDispatch();

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
    if (!optionsRef.current) {
      return;
    }

    const deltaX = 6;
    optionsRef.current.style.transform = `translateX(-${optionsRef.current?.offsetWidth - deltaX}px)`;

  }, [optionsRef.current?.offsetWidth]);

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
    if (message.id == null) {
      return;
    }

    onDelete(message.id);
    setShowOptions(false);
    setHide(true);
  };

  async function handleCopyClick() {
    await Clipboard.write({ string: message.content });
    setShowOptions(false);
  }

  function handleReplyClick() {
    const reply = { id: message.id, text: message.content.substring(0, REPLY_TEXT_MAX_LENGTH) }
    dispatch(setReply(reply))
  }

  function handleMessageReplyClick() {
    if (!message.replyTo) {
      return;
    }
    
    const messageElement = document.getElementById(`chat-message-container-${message.replyTo.id}`);
    if (messageElement) {
        messageElement.scrollIntoView({ behavior: "smooth" });
    }
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

  function handleTodo() {

  }

  if (hide) {
    return null;
  }

  return (
    <div className={`chat-message ${messageClass}`}>
      <div className={`chat-message-container ${textClass}`} id={`chat-message-container-${message.id}`}>
        {message.replyTo && (
          <div className="chat-message-reply" id={`reply-to-message-${message.replyTo.id}`} onClick={handleMessageReplyClick}>
            <div className="chat-message-reply-text">
              <div className="reply-icon">
                <i class="fa-solid fa-reply fa-flip-both"></i>
              </div>
              <div className="reply-text">
                {message.replyTo.text}
              </div>
            </div>
          </div>
        )}
        <div className="chat-message-bubble-container">
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
          <div className={`chat-message-icons-container ${message.id != null ? '' : 'chat-message-icons-container-disabled'}`} onClick={handleOptionsClick} ref={optionsRef}>
            <i className="fa fa-ellipsis-v chat-message-options-icon"></i>
            {showOptions && (
              <div className="chat-message-options-container" ref={optionsRef}>
                <div className="chat-message-options-items hide">
                  <div className="chat-message-options-item" onClick={handleTodo}>
                    <i className="fas fa-redo"></i>
                  </div>
                </div>
                <div className="chat-message-options-items">
                  <div className="chat-message-options-item" onClick={handleDeleteClick}>
                    <i className="fa fa-trash"></i>
                  </div>
                  <div className="chat-message-options-item" onClick={handleCopyClick}>
                    <i className="fa fas fa-clipboard"></i>
                  </div>
                  <div className="chat-message-options-item" onClick={handleReplyClick}>
                    <i className="fas fa-reply"></i>
                  </div>
                </div>
                <div className="chat-message-timestamp">
                  <div>{timestamp}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;