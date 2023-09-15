import React, { useEffect, useRef, useState } from 'react';
import './TextInput.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setReply, toggleSettings } from '../../redux/actions/uiActions';
import { getIsMobile, getReply } from '../../redux/selectors/uiSelectors';
import { editChatLoading } from '../../redux/selectors/chatSelectors';
import { isScrolledToBottom } from '../../utils/functions';

function TextInput(props) {
    const { onSubmit, canSubmit } = props;

    const dispatch = useDispatch();
    const isChatEditLoading = useSelector(editChatLoading);

    const textareaRef = useRef(null);
    const submitButtonRef = useRef(null);
    const settingsButtonRef = useRef(null);

    const isMobile = useSelector(getIsMobile);
    const reply = useSelector(getReply);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        updateButtonDisplay();
        resizeTextAreaHeight();
    }, [inputValue]);

    useEffect(() => {
        if (!reply) {
            return;
        }
        textareaRef.current.focus();
    }, [reply])

    function handleKeyDown(event) {
        if (event.key !== "Enter") {
            return;
        }

        const doLineBreak = (isMobile && !event.shiftKey) || (!isMobile && event.shiftKey);

        if (doLineBreak) {
            event.preventDefault(); // prevent form submission
            const selectionStart = event.target.selectionStart;
            const selectionEnd = event.target.selectionEnd;
            const text = event.target.value;

            event.target.value = text.slice(0, selectionStart) + "\n" + text.slice(selectionStart);

            event.target.selectionStart = selectionStart + 1;
            event.target.selectionEnd = selectionEnd + 1;
            handleOnInputChange();
        }
        else {
            handleSubmit(event);
        }
    }

    function updateButtonDisplay() {
        const text = textareaRef.current.value;
        if (text.length > 0) {
            submitButtonRef.current.classList.remove("fade");
        }
        else {
            submitButtonRef.current.classList.add("fade");
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (canSubmit(inputValue)) {
            onSubmit(inputValue);
            emptyTextArea();
        }
    }

    function handleOnInputChange() {
        setInputValue(textareaRef.current.value);
    }

    function handleToggleSettings() {
        if (isChatEditLoading) {
            return;
        }

        dispatch(toggleSettings());
    };

    function handleReplyClick() {
        const messageElement = document.getElementById(`chat-message-container-${reply.id}`);
        if (messageElement) {
            messageElement.scrollIntoView({ behavior: "smooth" });
        }
    }

    function handleCloseReplyClick(event) {
        event.preventDefault();
        dispatch(setReply(null));
    }

    function resizeTextAreaHeight() {
        const textarea = textareaRef.current;
        const oldHeight = textarea.offsetHeight;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;

        if (textarea.selectionStart === textarea.value.length) {
            textarea.scrollTop = textarea.scrollHeight;
        }
        const deltaHeight = textarea.offsetHeight - oldHeight;
        updateChatbotPaddingBottom(textarea.offsetHeight, deltaHeight);
    }

    function updateChatbotPaddingBottom(height, deltaHeight) {
        const chatBody = document.getElementsByClassName('chatbot-body')[0];
        if (chatBody) {
            chatBody.style.paddingBottom = `${50 + height}px`;
            if (!isScrolledToBottom(chatBody)) {
                chatBody.scrollTop += deltaHeight;
            }
        }
    }

    function emptyTextArea() {
        setInputValue('');
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = `${31}px`;
    }

    return (
        <form onSubmit={handleSubmit} className='text-input'>
            <div className='text-input-row'>
                {reply && (
                    <div className='text-input-reply' id={`reply-message-${reply.id}`}>
                        <div className='text-input-reply-text'>
                            <div className='reply-to-text' onClick={handleReplyClick}>{reply.text}</div>
                            <div className='reply-to-close' onClick={handleCloseReplyClick}>x</div>
                        </div>
                    </div>
                )}
            </div>
            <div className='text-input-row text-input-row-textarea'>
                <textarea
                    className='text-input-textarea'
                    ref={textareaRef}
                    rows="1"
                    placeholder="send a message"
                    value={inputValue}
                    onChange={handleOnInputChange}
                    onKeyDown={handleKeyDown}
                />
                <div className='text-input-buttons'>
                    <button type="submit" className='chatbot-send-button' ref={submitButtonRef}>
                        <i className="fas fa-paper-plane chatbot-send-icon"></i>
                    </button>
                    <button className={`chatbot-settings-button ${isChatEditLoading ? 'settings-saving' : ''}`} ref={settingsButtonRef} onClick={(event) => {
                        event.preventDefault();
                        handleToggleSettings();
                    }}>
                        <i className={`fas fa-cog text-input-settings-icon`}></i>
                    </button>
                </div>
            </div>
        </form>
    );
}

export default TextInput;