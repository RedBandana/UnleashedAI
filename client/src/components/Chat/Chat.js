import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Capacitor } from '@capacitor/core';

import Message from '../Message/Message';
import Settings from '../Settings/Settings';
import TextInput from '../TextInput/TextInput';
import TypingDots from '../TypingDots/TypingDots';

import './Chat.scss';
import { getSettingsIsOpen, getSidebarIsOpen } from '../../redux/selectors/uiSelectors';
import { fetchMessageLoading } from '../../redux/selectors/messageSelectors';
import { setSettingsIsOpen } from '../../redux/actions/uiActions';

function Chat(props) {
    const { index, messages, crudEvents } = props;

    const dispatch = useDispatch();

    const [messagesHtml, setMessagesHtml] = useState([]);
    const [messageReceived, setMessageReceived] = useState(false);
    const [messageDeletedIndex, setMessageDeletedIndex] = useState(-1);

    const chatBodyRef = useRef(null);
    const settingsRef = useRef(null);

    const sidebarIsOpen = useSelector(getSidebarIsOpen);
    const settingsIsOpen = useSelector(getSettingsIsOpen);
    const messageLoading = useSelector(fetchMessageLoading);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    useEffect(() => {
        if (messagesHtml.length === 0) {
            setMessagesHtmlToDisplay();
        }
        scrollToBottom("smooth");
    }, [messages, messagesHtml, setMessagesHtmlToDisplay])

    useEffect(() => {
        if (messageReceived) {
            addMessageHtmlToDisplay();
        }
        setMessageReceived(false);
    }, [messages, messageReceived, addMessageHtmlToDisplay])

    useEffect(() => {
        if (messageDeletedIndex !== -1) {
            setMessagesHtml(prevMessages => {
                const newMessages = [...prevMessages];
                newMessages.splice(messageDeletedIndex, 1);
                return newMessages;
            });
        }
        setMessageDeletedIndex(-1);
    }, [messageDeletedIndex])

    function setMessagesHtmlToDisplay() {
        const htmlToDisplay = messages.map((message, index) => (
            <Message key={index} index={index} message={message} onDelete={handleDelete} />
        ));
        setMessagesHtml(htmlToDisplay);
    }

    function addMessageHtmlToDisplay() {
        const messageIndex = messages.length - 1;
        const message = messages[messageIndex];
        const newMessageHtml = <Message key={messageIndex} index={messageIndex} message={message} onDelete={handleDelete} />
        setMessagesHtml(prevMessages => [...prevMessages, newMessageHtml]);
    }

    function handleCanAdd(inputValue) {
        if (inputValue.trim() === '') {
            return false;
        }
        return !messageLoading;
    }

    function handleAdd(inputValue) {
        const userMessage = {
            texts: [inputValue.trim()],
            isUser: true,
            timestamp: new Date()
        };

        crudEvents.create(index, userMessage);
    };

    function handleDelete(messageIndex) {
        crudEvents.delete(index, messageIndex)
    }

    function handleSettingsSave(newSettings) {
        crudEvents.settingsUpdate(index, newSettings);
    };

    function handleClickOutside(event) {
        if (settingsRef.current && !settingsRef.current.contains(event.target) &&
            event.target.className !== "chatbot-settings-button" && event.target.className !== "fas fa-cog") {
            dispatch(setSettingsIsOpen(false));
        }
    };

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
                        {messagesHtml}
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
                    <TextInput
                        onSubmit={handleAdd}
                        canSubmit={handleCanAdd}
                    />
                </div>
            </div>
        </div>
    );
}

export default Chat;