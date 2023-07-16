import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Capacitor } from '@capacitor/core';

import Message from '../Message/Message';
import Settings from '../Settings/Settings';
import TextInput from '../TextInput/TextInput';
import TypingDots from '../TypingDots/TypingDots';

import './Chat.scss';
import { getSettings, getSettingsIsOpen, getSidebarIsOpen } from '../../redux/selectors/uiSelectors';
import { createMessageLoading, createMessageReceived, fetchMessagesReceived } from '../../redux/selectors/messageSelectors';
import { setSettingsIsOpen } from '../../redux/actions/uiActions';

function Chat(props) {
    const { index, messages, crudEvents } = props;
    const [messagesHtml, setMessagesHtml] = useState([]);

    const dispatch = useDispatch();

    const chatBodyRef = useRef(null);
    const settingsRef = useRef(null);

    const sidebarIsOpen = useSelector(getSidebarIsOpen);
    const settingsIsOpen = useSelector(getSettingsIsOpen);
    const formSettings = useSelector(getSettings);
    const messageLoading = useSelector(createMessageLoading);
    const messagesReceived = useSelector(fetchMessagesReceived);
    const messageReceived = useSelector(createMessageReceived);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        handleSettingsSave(formSettings);
    }, [settingsIsOpen]);

    useEffect(() => {
        if (!messagesReceived) {
            return;
        }
        setMessagesHtmlToDisplay();
        scrollToBottom("smooth");
    }, [messagesReceived]);

    useEffect(() => {
        if (!messageReceived || messages.length === 0) {
            return;
        }

        addMessageHtmlToDisplay(messages[messages.length - 1]);
        scrollToBottom("smooth");
    }, [messageReceived]);

    function setMessagesHtmlToDisplay() {
        const htmlToDisplay = messages.map((message, index) => (
            <Message key={index} index={index} message={message} onDelete={handleOnDeleteMessage} onSelectChoice={handleOnSelectChoice} />
        ));
        setMessagesHtml(htmlToDisplay);
    }

    function addMessageHtmlToDisplay(message) {
        const index = messagesHtml.length;
        const newMessageHtml = <Message key={index} index={index} message={message} onDelete={handleOnDeleteMessage} onSelectChoice={handleOnSelectChoice} />
        setMessagesHtml(prevMessages => [...prevMessages, newMessageHtml]);
    }

    function removeMessagesHtmlToDisplay(index) {
        setMessagesHtml(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages.splice(index, 1);
            return newMessages;
        });
    }

    function handleCanAdd(inputValue) {
        if (messageLoading || inputValue.trim() === '') {
            return false;
        }
        return true;
    }

    function handleAdd(inputValue) {
        const text = inputValue.trim();
        const messageRequest = { content: text };
        crudEvents.onCreate(index, messageRequest);

        const message = {
            content: text,
            isUser: true,
            creationTime: new Date(),
        }

        addMessageHtmlToDisplay(message);
    }

    function handleSettingsSave(settings) {
        crudEvents.onSettingsUpdate(index, settings);
    }

    function handleOnDeleteMessage(messageIndex) {
        crudEvents.onDelete(index, messageIndex);
        removeMessagesHtmlToDisplay(messageIndex);
    }
    
    function handleOnSelectChoice(messageIndex, choiceIndex) {
        crudEvents.onSelectChoice(index, messageIndex, choiceIndex);
    }

    function handleClickOutside(event) {
        if (settingsRef.current && !settingsRef.current.contains(event.target) &&
            event.target.className !== "chatbot-settings-button" && event.target.className !== "fas fa-cog") {
            dispatch(setSettingsIsOpen(false));
        }
    }

    function scrollToBottom(behavior) {
        chatBodyRef.current.scrollTo({
            top: chatBodyRef.current.scrollHeight,
            behavior: behavior,
        });
    }

    return (
        <div className="chatbot" data-sidebar-is-open={sidebarIsOpen} data-is-mobile={Capacitor.isNativePlatform()}>
            <div className='chatbot-container'>
                <div className="chatbot-body" ref={chatBodyRef}>
                    <div className="chatbot-messages">
                        {messages && (messagesHtml)}
                    </div>
                    {messageLoading && (
                        <div className='chatbot-dots'>
                            <TypingDots />
                        </div>
                    )}
                </div>
                {settingsIsOpen && (
                    <div className="chatbot-settings-container" ref={settingsRef}>
                        <Settings onSave={handleSettingsSave} />
                    </div>
                )}
                <div className="chatbot-footer">
                    <TextInput onSubmit={handleAdd} canSubmit={handleCanAdd} />
                </div>
            </div>
        </div>
    );
}

export default Chat;