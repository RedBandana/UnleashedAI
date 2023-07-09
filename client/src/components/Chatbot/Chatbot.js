import React, { useState, useRef, useEffect, useCallback } from 'react';
import Message from '../Message/Message';
import Settings from '../Settings/Settings';
import './Chatbot.scss';
import { sendChatCompletion, trySendRequest } from '../../api/openai.service';
import { getModelMaxTokens } from '../../utils/Utils'
import TextInput from '../TextInput/TextInput';
import TypingDots from '../TypingDots/TypingDots'
import { Capacitor } from '@capacitor/core';

function Chatbot(props) {
    const { sidebarIsOpen, conversation, conversationChangeTrigger } = props;
    const [isInitialized, setIsInitialized] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const chatbotBodyRef = useRef(null);
    const settingsRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [receivedNewMessage, setReceivedNewMessage] = useState(0);
    const [messageUpdate, setMessageUpdate] = useState(false);
    const [messagesHtml, setMessagesHtml] = useState([]);
    const TOKEN_SAFE_DELTA = 2000;

    const handleDelete = useCallback((messageIndex) => {
        setMessagesHtml(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages.splice(messageIndex, 1);
            return newMessages;
        });

        conversation.messages.splice(messageIndex, 1);
        setMessageUpdate(!messageUpdate);
    }, [conversation, messageUpdate]);

    const setMessagesHtmlToDisplay = useCallback(() => {
        const htmlToDisplay = conversation.messages.map((message, index) => (
            <Message key={index} index={index} message={message} onDelete={handleDelete} />
        ));
        setMessagesHtml(htmlToDisplay);
        setIsInitialized(true);
    }, [conversation, handleDelete])

    const addMessagesHtmlToDisplay = useCallback(() => {
        const messageIndex = conversation.messages.length - 1;
        const message = conversation.messages[messageIndex];
        const newMessageHtml = <Message key={messageIndex} index={messageIndex} message={message} onDelete={handleDelete} />
        setMessagesHtml(prevMessages => [...prevMessages, newMessageHtml]);
    }, [conversation, handleDelete])

    useEffect(() => {
        setMessagesHtmlToDisplay();
    }, [conversationChangeTrigger, setMessagesHtmlToDisplay]);

    useEffect(() => {
        if (isInitialized) {
            scrollToBottom("auto");
            setIsInitialized(false);
        }
    }, [isInitialized]);

    useEffect(() => {
        setReceivedNewMessage(0);
    }, [conversationChangeTrigger, receivedNewMessage])

    useEffect(() => {
        if (receivedNewMessage !== 0) {
            addMessagesHtmlToDisplay();
        }

        scrollToBottom("smooth");
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [receivedNewMessage, addMessagesHtmlToDisplay]);

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

        const userMessage = {
            texts: [inputText],
            isUser: true,
            timestamp: new Date().getTime()
        };
        conversation.messages.push(userMessage);

        emptyTextArea();
        setIsWaiting(true);
        setReceivedNewMessage(1);

        let requestMessages = getRequestMessages([...conversation.messages]);
        const requestMaxTokens = conversation.settings.maxTokens === 0 ? null : conversation.settings.maxTokens;
        const requestSettings = {
            ...conversation.settings, history: requestMessages, maxTokens: requestMaxTokens
        }

        trySendRequest(sendChatCompletion, requestSettings).then((response) => {
            const botMessage = {
                texts: response,
                isUser: false,
                timestamp: new Date().getTime()
            };
            conversation.messages.push(botMessage);
            setIsWaiting(false);
            setReceivedNewMessage(2);
        });
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
                    <div className="chatbot-messages">
                        {messagesHtml}
                    </div>
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