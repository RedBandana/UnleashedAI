import React, { useState, useRef, useEffect } from 'react';
import ChatHistory from './ChatHistory';
import Settings from '../Settings/Settings';
import './Chatbot.css';
import { sendChatCompletion, trySendRequest } from '../../api/openai';
import { resizeElement } from '../../utils/Utils'

function Chatbot() {
    const TOKEN_SAFE_LIMIT = 3250;
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const chatbotBodyRef = useRef(null);
    const settingsRef = useRef(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [formSettings, setFormSettings] = useState({
        model: 'gpt-3.5-turbo',
        system: 'You are a professional programmer.',
        temperature: 0.7,
        topP: 1,
        quantity: 1,
        stream: false,
        stop: '',
        maxTokens: 0,
        presencePenalty: 0,
        frequencyPenalty: 0,
        user: ''
    });

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        resizeElement("textarea-user-input");
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (inputValue === '') {
            return;
        }

        const newMessage = { texts: [inputValue], isUser: true, timestamp: new Date().getTime() };
        setMessages((prevState) => [...prevState, newMessage]);
        setInputValue('');

        let requestMessages = getRequestMessages([...messages, newMessage]);
        const requestMaxTokens = formSettings.maxTokens === 0 ? null : formSettings.maxTokens;
        const requestSettings = {
            ...formSettings, history: requestMessages, maxTokens: requestMaxTokens
        }

        const response = await trySendRequest(sendChatCompletion, requestSettings);
        setMessages((prevState) => [...prevState, { texts: response, isUser: false, timestamp: new Date().getTime() }]);
    };

    const handleDelete = (messageToDelete) => {
        setMessages(messages.filter(message => message !== messageToDelete));
    };

    const handleSettingsButtonClick = () => {
        setSettingsOpen(!settingsOpen);
    };

    const handleSettingsSave = (settings) => {
        setFormSettings(settings);
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
    }, [messages]);

    return (
        <div className="chatbot">
            <div className="chatbot-header">
                <div className="chatbot-title">GPT Unlimited</div>
            </div>
            <div className="chatbot-body" ref={chatbotBodyRef}>
                <ChatHistory messages={messages} onDelete={handleDelete} />
            </div>
            {settingsOpen && (
                <div className="chatbot-settings-container" ref={settingsRef}>
                    <Settings
                        settings={formSettings}
                        onSave={handleSettingsSave}
                        onClose={handleSettingsClose}
                    />
                </div>
            )}
            <div className="chatbot-footer">
                <form onSubmit={handleFormSubmit}>
                    <textarea
                        id="textarea-user-input"
                        rows="1"
                        placeholder="Type your message here..."
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' && !event.shiftKey) {
                                handleFormSubmit(event);
                            }
                        }}
                    />
                    <button type="submit" className='chatbot-send-button'>
                        <i className="fas fa-paper-plane"></i>
                    </button>
                    <button className="chatbot-settings-button" onClick={(event) => {
                        event.preventDefault();
                        handleSettingsButtonClick();
                    }}>
                        <i className="fas fa-cog"></i>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Chatbot;