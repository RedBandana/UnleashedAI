import React, { useState, useRef, useEffect } from 'react';
import ChatHistory from './ChatHistory';
import Settings from '../Settings/Settings';
import './Chatbot.css';
import { sendChatCompletion, trySendRequest } from '../../api/openai';
import { formatText, resizeElement } from '../../utils/Utils'

function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const chatbotBodyRef = useRef(null);
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

    const handleDelete = (messageToDelete) => {
        setMessages(messages.filter(message => message !== messageToDelete));
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        resizeElement("textarea-user-input");
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (inputValue === '') {
            return;
        }

        const newMessage = { text: inputValue, isUser: true, timestamp: new Date().getTime() };
        setMessages((prevState) => [...prevState, newMessage]);
        setInputValue('');

        const requestMaxTokens = formSettings.maxTokens == 0 ? null : formSettings.maxTokens;
        const requestSettings = {
            ...formSettings, history: [...messages, newMessage], maxTokens: requestMaxTokens
        }

        const response = await trySendRequest(sendChatCompletion, requestSettings);
        const formatedText = formatText(response);
        setMessages((prevState) => [...prevState, { text: formatedText, isUser: false, timestamp: new Date().getTime() }]);
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

    useEffect(() => {
        resizeElement("textarea-user-input");

        // Scroll down chatbot-body when messages change
        chatbotBodyRef.current.scrollTo({
            top: chatbotBodyRef.current.scrollHeight,
            behavior: "smooth",
        });
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
                <Settings
                    settings={formSettings}
                    onSave={handleSettingsSave}
                    onClose={handleSettingsClose}
                />
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
                    <button type="submit">
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
