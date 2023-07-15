import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './TextInput.scss';
import { Capacitor } from '@capacitor/core';
import { useDispatch } from 'react-redux';
import { toggleSettings } from '../../redux/actions/uiActions';

function TextInput(props) {
    const { onSubmit, canSubmit } = props;

    const dispatch = useDispatch();

    const textareaRef = useRef(null);
    const submitButtonRef = useRef(null);
    const settingsButtonRef = useRef(null);

    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        updateButtonDisplay();
        resizeTextAreaHeight();
    }, [inputValue])

    function handleKeyDown(event) {
        if (event.key !== "Enter") {
            return;
        }

        const isNative = Capacitor.isNativePlatform();
            const doLineBreak = (isNative && !event.shiftKey) || (!isNative && event.shiftKey);

            if (doLineBreak) {
                event.preventDefault(); // prevent form submission
                const selectionStart = textareaRef.current.selectionStart;
                const selectionEnd = textareaRef.current.selectionEnd;
                const text = textareaRef.current.value;

                setInputValue(text.slice(0, selectionStart) + "\n" + text.slice(selectionStart));

                textareaRef.current.selectionStart = selectionStart + 1;
                textareaRef.current.selectionEnd = selectionEnd + 1;
            }
            else {
                handleSubmit(event);
            }
    }

    function updateButtonDisplay() {
        const text = textareaRef.current.value;
        if (text.length > 0) {
            submitButtonRef.current.classList.remove("hide");
            settingsButtonRef.current.classList.add("hide");
        }
        else {
            submitButtonRef.current.classList.add("hide");
            settingsButtonRef.current.classList.remove("hide");
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
        dispatch(toggleSettings());
    };
    
    function resizeTextAreaHeight() {
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;

        if (textarea.selectionStart === textarea.value.length) {
            textarea.scrollTop = textarea.scrollHeight;
        }
    }

    function emptyTextArea() {
        setInputValue('');
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = `${31}px`;
    }

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                ref={textareaRef}
                rows="1"
                placeholder="Send a message"
                value={inputValue}
                onChange={handleOnInputChange}
                onKeyDown={handleKeyDown}
            />
            <button type="submit" className='chatbot-send-button' ref={submitButtonRef}>
                <i className="fas fa-paper-plane chatbot-send-icon"></i>
            </button>
            <button className="chatbot-settings-button" ref={settingsButtonRef} onClick={(event) => {
                event.preventDefault();
                handleToggleSettings();
            }}>
                <i className="fas fa-cog"></i>
            </button>
        </form>
    );
}

TextInput.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    canSubmit: PropTypes.func.isRequired,
};

export default TextInput;