import React, { useState, useRef, useEffect } from 'react';
import ChatHistory from './ChatHistory';
import Settings from '../Settings/Settings';
import './Chatbot.scss';
import { sendChatCompletion, trySendRequest } from '../../api/openai';
import { resizeElement } from '../../utils/Utils'
import TextInput from '../TextInput/TextInput';
import TypingDots from '../TypingDots/TypingDots'

function Chatbot(props) {
    const { sidebarIsOpen, conversation } = props;
    const TOKEN_SAFE_LIMIT = 10000000;
    const [isWaiting, setIsWaiting] = useState(false);
    const chatbotBodyRef = useRef(null);
    const settingsRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [settingsOpen, setSettingsOpen] = useState(false);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        resizeElement("textarea-user-input");
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

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (inputValue === '') {
            return;
        }

        const newMessage = { texts: [inputValue], isUser: true, timestamp: new Date().getTime() };
        conversation.messages.push(newMessage);
        setInputValue('');
        setIsWaiting(true);

        let requestMessages = getRequestMessages([...conversation.messages, newMessage]);
        const requestMaxTokens = conversation.settings.maxTokens === 0 ? null : conversation.settings.maxTokens;
        const requestSettings = {
            ...conversation.settings, history: requestMessages, maxTokens: requestMaxTokens
        }

        const response = await trySendRequest(sendChatCompletion, requestSettings);
        conversation.messages.push({ texts: response, isUser: false, timestamp: new Date().getTime() });
        setIsWaiting(false);
    };

    const handleDelete = (messageToDelete) => {
        conversation.messages = conversation.messages.filter(message => message !== messageToDelete);
    };

    const handleSettingsButtonClick = () => {
        setSettingsOpen(!settingsOpen);
    };

    const handleSettingsSave = (settings) => {
        conversation.settings = settings;
        setSettingsOpen(false);
    };

    const handleSettingsClose = () => {
        setSettingsOpen(false);
    };

    const getRequestMessages = (messages) => {
        while (countWordsInMessages(messages) > TOKEN_SAFE_LIMIT) {
            messages.splice(0, 1);
        }
        return messages;
    }

    const countWordsInMessages = (messages) => {
        let totalWords = 0;
        for (let message of messages) {
            totalWords += message.texts.join('').split(' ').length;
        }
        return totalWords;
    }

    const handleClickOutside = (event) => {
        if (settingsRef.current && !settingsRef.current.contains(event.target) &&
            event.target.className !== "chatbot-settings-button" && event.target.className !== "fas fa-cog") {
            setSettingsOpen(false);
        }
    };

    useEffect(() => {
        resizeElement("textarea-user-input");

        // Scroll down chatbot-body when messages change
        chatbotBodyRef.current.scrollTo({
            top: chatbotBodyRef.current.scrollHeight,
            behavior: "smooth",
        });

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [conversation.messages]);

    return (
        <div className="chatbot" data-sidebar-is-open={sidebarIsOpen}>
            <div className="chatbot-body" ref={chatbotBodyRef}>
                <ChatHistory messages={conversation.messages} onDelete={handleDelete} />
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