import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Capacitor } from '@capacitor/core';
import Prism from 'prismjs';

import Message from '../Message/Message';
import Settings from '../Settings/Settings';
import TextInput from '../TextInput/TextInput';
import TypingDots from '../TypingDots/TypingDots';

import './Chat.scss';
import { getMessagesPage, getSettings, getSettingsIsOpen, getSidebarIsOpen } from '../../redux/selectors/uiSelectors';
import { createMessageLoading, createMessageReceived, fetchChoiceValue, fetchMessagesLoading, fetchMessagesPageReceived, fetchMessagesReceived } from '../../redux/selectors/messageSelectors';
import { SetMessagesPage, setSettingsIsOpen } from '../../redux/actions/uiActions';
import { deleteChatValue } from '../../redux/selectors/chatSelectors';
import Loading from '../Loading/Loading';
import { fixHtmlMarkdown } from '../../utils/functions';
import { COUNT } from '../../utils/constants';

function Chat(props) {
    const { id, messages, crudEvents } = props;
    const [messagesHtml, setMessagesHtml] = useState([]);
    const [shouldScroll, setShouldScroll] = useState("none");
    const [settingsInitialized, setSettingsInitialized] = useState(false);
    const [mesagesRendered, setMesagesRendered] = useState([]);
    const [baseMessagesRendered, setBaseMessagesRendered] = useState(false);

    const chatBodyRef = useRef(null);
    const settingsRef = useRef(null);

    const dispatch = useDispatch();
    const sidebarIsOpen = useSelector(getSidebarIsOpen);
    const settingsIsOpen = useSelector(getSettingsIsOpen);
    const formSettings = useSelector(getSettings);
    const isWaitingAnswer = useSelector(createMessageLoading);
    const isLoading = useSelector(fetchMessagesLoading);
    const messagesReceived = useSelector(fetchMessagesReceived);
    const messagesPageReceived = useSelector(fetchMessagesPageReceived);
    const messageReceived = useSelector(createMessageReceived);
    const chatDeleted = useSelector(deleteChatValue);
    const choice = useSelector(fetchChoiceValue);
    const page = useSelector(getMessagesPage);

    useEffect(() => {
        setBaseMessagesRendered(false);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (settingsIsOpen) {
            setSettingsInitialized(true);
        }

        if (!settingsIsOpen && settingsInitialized) {
            handleSettingsSave(formSettings);
        }

    }, [settingsIsOpen]);

    useEffect(() => {
        if (!messagesReceived) {
            setMessagesHtml([]);
            return;
        }
        setBaseMessagesRendered(false);
        setMessagesHtmlToDisplay();
    }, [messagesReceived]);

    useEffect(() => {
        if (!messagesPageReceived) {
            return;
        }

        const retrievedMessages = [];
        for (let i = 0; i < COUNT; i++) {
            const message = messages[i];
            const newMessageHtml = <Message key={message.id} index={i} id={message.id} message={message} shouldRender={true}
                onDelete={handleOnDeleteMessage} onSelectChoice={handleOnSelectChoice} onRender={handleMessageRendered} />;
            retrievedMessages.push(newMessageHtml);
        }
        setMessagesHtml(prevMessages => [...retrievedMessages, ...prevMessages]);
        chatBodyRef.current.scrollTop = 100;

    }, [messagesPageReceived])

    useEffect(() => {
        if (!messageReceived || messages.length === 0) {
            return;
        }
        addMessageHtmlToDisplay(messages[messages.length - 1]);
    }, [messageReceived]);

    useEffect(() => {
        if (chatDeleted) {
            setMessagesHtml([]);
        }
    }, [chatDeleted])

    useEffect(() => {
        if (!choice || !messages) {
            return;
        }

        const index = messages.findIndex(m => m.id === choice.messageId);
        const message = messages[index];
        if (!message) {
            return;
        }

        const updatedMessageHtml = <Message key={message.id} index={index} id={message.id} message={message} shouldRender={true}
            onDelete={handleOnDeleteMessage} onSelectChoice={handleOnSelectChoice} onRender={handleMessageRendered} />
        const messagesToDisplay = [...messagesHtml];
        messagesToDisplay[index] = updatedMessageHtml;
        setMessagesHtml(messagesToDisplay);
    }, [choice]);

    useEffect(() => {
        if (!messages || messages.length === 0 || baseMessagesRendered) {
            return;
        }

        if (!baseMessagesRendered && messages.length > 0 && mesagesRendered.every(rendered => rendered === true)) {
            const chatMessages = document.getElementsByClassName(`chat-message-text`);
            fixHtmlMarkdown(Prism, chatMessages);
            setBaseMessagesRendered(true);
            setShouldScroll("auto");
        }
    }, [mesagesRendered]);

    useEffect(() => {
        if (shouldScroll !== "none") {
            scrollToBottom(shouldScroll);
            setShouldScroll("none");
        }
    }, [shouldScroll])

    useEffect(() => {
        chatBodyRef.current.addEventListener('scroll', handleScroll);

        return () => {
            chatBodyRef.current.removeEventListener('scroll', handleScroll);
        };
    }, [chatBodyRef, id, isLoading, handleScroll]);

    function handleMessageRendered(index) {
        setMesagesRendered(prevStatus => {
            const updatedStatus = [...prevStatus];
            updatedStatus[index] = true;
            return updatedStatus;
        });
    };

    function setMessagesHtmlToDisplay() {
        const htmlToDisplay = messages.map((message, index) => (
            <Message key={message.id} index={index} id={message.id} message={message} shouldRender={false}
                onDelete={handleOnDeleteMessage} onSelectChoice={handleOnSelectChoice} onRender={handleMessageRendered} />
        ));
        setMessagesHtml(htmlToDisplay);
    }

    function addMessageHtmlToDisplay(message) {
        const index = messagesHtml.length;
        const newMessageHtml = <Message key={message.id} index={index} id={message.id} message={message} shouldRender={true}
            onDelete={handleOnDeleteMessage} onSelectChoice={handleOnSelectChoice} onRender={handleMessageRendered} />;
        setMessagesHtml(prevMessages => [...prevMessages, newMessageHtml]);
        setShouldScroll("smooth");
    }

    function handleCanAdd(inputValue) {
        if (isWaitingAnswer || inputValue.trim() === '') {
            return false;
        }
        return true;
    }

    function handleAdd(inputValue) {
        const text = inputValue.trim();
        const messageRequest = { content: text };
        crudEvents.onCreate(id, messageRequest);

        const message = {
            content: text,
            isUser: true,
            creationTime: new Date(),
        }

        addMessageHtmlToDisplay(message);
    }

    function handleSettingsSave(settings) {
        crudEvents.onSettingsUpdate(id, settings);
    }

    function handleOnDeleteMessage(messageId) {
        crudEvents.onDelete(id, messageId);
    }

    function handleOnSelectChoice(messageId, choiceIndex) {
        crudEvents.onSelectChoice(id, messageId, choiceIndex);
    }

    function handleClickOutside(event) {
        if (settingsRef.current && !settingsRef.current.contains(event.target) &&
            event.target.className !== "chatbot-settings-button" && event.target.className !== "fas fa-cog") {
            dispatch(setSettingsIsOpen(false));
        }
    }

    function handleScroll() {
        if (!isLoading && chatBodyRef.current.scrollTop === 0) {
            const nextPage = page + 1;
            dispatch(SetMessagesPage(nextPage));
            crudEvents.onScrollTop(id, nextPage);
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
                    {page !== 1 && (isLoading) && (
                        <Loading />
                    )}
                    <div className="chatbot-messages">
                        {messages && (messagesHtml)}
                    </div>
                    {page === 1 && (isLoading) && (
                        <Loading />
                    )}
                    {isWaitingAnswer && (
                        <div className='chatbot-dots'>
                            <TypingDots />
                        </div>
                    )}
                </div>
                {settingsIsOpen && (
                    <div className="chatbot-settings-container" ref={settingsRef}>
                        <Settings />
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