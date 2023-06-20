import React, { useState, useRef, useEffect } from 'react';
import ChatHistory from './ChatHistory';
import Settings from '../Settings/Settings';
import './Chatbot.scss';
import { sendChatCompletion, trySendRequest } from '../../api/openai';
import { getModelMaxTokens } from '../../utils/Utils'
import TextInput from '../TextInput/TextInput';
import TypingDots from '../TypingDots/TypingDots'

function Chatbot(props) {
    const { sidebarIsOpen, conversation, conversationUpdate } = props;
    const [isWaiting, setIsWaiting] = useState(false);
    const chatbotBodyRef = useRef(null);
    const settingsRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [receivedNewMessage, setReceivedNewMessage] = useState(false);
    const [messageUpdate, setMessageUpdate] = useState(false);
    const TOKEN_SAFE_DELTA = 1500;

    useEffect(() => {
        scrollToBottom("auto");
    }, [conversationUpdate]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        resizeTextAreaHeight();
    };

    function canSubmitForm(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            if (!isWaiting) {
                return true;
            }
            else {
                event.preventDefault();
            }
        }
        return false;
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();

        if (inputValue === '') {
            return;
        }

        const newMessage = { texts: [inputValue], isUser: true, timestamp: new Date().getTime() };
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
        const element = document.getElementById("textarea-user-input");
        element.style.height = "auto";
        element.style.height = `${element.scrollHeight}px`;
    }

    function emptyTextArea() {
        setInputValue('');
        const element = document.getElementById("textarea-user-input");
        element.style.height = "auto";
        element.style.height = `${31}px`;
    }

    useEffect(() => {
        resizeTextAreaHeight();
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
        <div className="chatbot" data-sidebar-is-open={sidebarIsOpen}>
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
    );
}

export default Chatbot;