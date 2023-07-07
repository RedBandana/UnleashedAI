import React, { useState, useRef, useEffect } from 'react';
import ChatHistory from './ChatHistory';
import Settings from '../Settings/Settings';
import './Chatbot.scss';
import { sendChatCompletion, trySendRequest } from '../../api/openai.service';
import { getModelMaxTokens } from '../../utils/Utils'
import TextInput from '../TextInput/TextInput';
import TypingDots from '../TypingDots/TypingDots'
import { Capacitor } from '@capacitor/core';

function Chatbot(props) {
    const { sidebarIsOpen, conversation, conversationUpdate } = props;
    const [isWaiting, setIsWaiting] = useState(false);
    const chatbotBodyRef = useRef(null);
    const settingsRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [receivedNewMessage, setReceivedNewMessage] = useState(false);
    const [messageUpdate, setMessageUpdate] = useState(false);
    const TOKEN_SAFE_DELTA = 2000;

    useEffect(() => {
        scrollToBottom("auto");
    }, [conversationUpdate]);

    useEffect(() => {
        resizeTextAreaHeight();
    }, [inputValue])

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    function canSubmitForm(event) {
        if (!isWaiting) {
            return true;
        }
        return false;
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const inputText = inputValue.trim();
        if (inputText === '') {
            return;
        }

        const newMessage = { texts: [inputText], isUser: true, timestamp: new Date().getTime() };
        conversation.messages.push(newMessage);

        emptyTextArea();
        setIsWaiting(true);
        setReceivedNewMessage(true);

        let requestMessages = getRequestMessages([...conversation.messages]);
        const requestMaxTokens = conversation.settings.maxTokens === 0 ? null : conversation.settings.maxTokens;
        const requestSettings = {
            ...conversation.settings, history: requestMessages, maxTokens: requestMaxTokens
        }

        trySendRequest(sendChatCompletion, requestSettings).then((response) => {
            conversation.messages.push({ texts: response, isUser: false, timestamp: new Date().getTime() });
            setIsWaiting(false);
            setReceivedNewMessage(false);
        });
    };

    const handleDelete = (messageIndex) => {
        const newMessages = [...conversation.messages];
        newMessages.splice(messageIndex, 1);
        conversation.messages = newMessages;

        setMessageUpdate(!messageUpdate);
    };

    const handleSettingsButtonClick = () => {
        setSettingsOpen(!settingsOpen);
    };

    const handleSettingsSave = (settings) => {
        conversation.settings = settings;
    };

    const handleSettingsClose = () => {
        setSettingsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (settingsRef.current && !settingsRef.current.contains(event.target) &&
            event.target.className !== "chatbot-settings-button" && event.target.className !== "fas fa-cog") {
            setSettingsOpen(false);
        }
    };

    const getRequestMessages = (messages) => {
        while (messages.length > 1 &&
            getMessagesTokens(messages) > getModelMaxTokens(conversation.settings.model) - TOKEN_SAFE_DELTA) {
            messages.splice(0, 1);
        }
        return messages;
    }

    const getMessagesTokens = (messages) => {
        let totalTokens = 0;
        for (let message of messages) {
            for (let text of message.texts) {
                totalTokens += text.split(' ').length;
            }
        }

        return totalTokens;
    }

    function resizeTextAreaHeight() {
        const textarea = document.getElementById("textarea-user-input");
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;

        if (textarea.selectionStart === textarea.value.length) {
            textarea.scrollTop = textarea.scrollHeight;
        }
    }

    function emptyTextArea() {
        setInputValue('');
        const textarea = document.getElementById("textarea-user-input");
        textarea.style.height = "auto";
        textarea.style.height = `${31}px`;
    }

    useEffect(() => {
        scrollToBottom("smooth");
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [receivedNewMessage]);

    function scrollToBottom(behavior) {
        chatbotBodyRef.current.scrollTo({
            top: chatbotBodyRef.current.scrollHeight,
            behavior: behavior,
        });
    }

    return (
        <div className="chatbot" data-sidebar-is-open={sidebarIsOpen} data-is-mobile={Capacitor.isNativePlatform()}>
            <div className='chatbot-container'>
                <div className="chatbot-body" ref={chatbotBodyRef}>
                    {(messageUpdate || !messageUpdate) && (
                        <ChatHistory messages={conversation.messages} onDelete={handleDelete} />
                    )}

                    {isWaiting && (
                        <div className='chatbot-dots'>
                            <TypingDots />
                        </div>
                    )}
                </div>
                {settingsOpen && (
                    <div className="chatbot-settings-container" ref={settingsRef}>
                        <Settings
                            settings={conversation.settings}
                            onSave={handleSettingsSave}
                            onClose={handleSettingsClose}
                        />
                    </div>
                )}
                <div className="chatbot-footer">
                    <TextInput
                        inputValue={inputValue}
                        onInputChange={handleInputChange}
                        onSubmit={handleFormSubmit}
                        canSubmit={canSubmitForm}
                        onSettings={handleSettingsButtonClick}
                    />
                </div>
            </div>
        </div>
    );
}

export default Chatbot;