import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './TextInput.scss';

function TextInput({ inputValue, onInputChange, onSubmit, canSubmit, onSettings }) {

    useEffect(() => {
        updateButtonDisplay();
    }, [inputValue])

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            const isMobile = process.env.REACT_APP_CLIENT_TYPE === 'mobile';
            const doLineBreak = (isMobile && !event.shiftKey) || (!isMobile && event.shiftKey);

            if (doLineBreak) {
                event.preventDefault(); // prevent form submission
                const selectionStart = event.target.selectionStart;
                const selectionEnd = event.target.selectionEnd;
                const text = event.target.value;
    
                event.target.value = text.slice(0, selectionStart) + "\n" + text.slice(selectionStart);
    
                event.target.selectionStart = selectionStart + 1;
                event.target.selectionEnd = selectionEnd + 1;
    
                onInputChange(event); // insert line break
            }
            else {
                handleSubmit(event);
            }
        }
    }

    function updateButtonDisplay() {
        const submitButton = document.getElementById("button-submit");
        const settingsButton = document.getElementById("button-settings");
        const text = document.getElementById("textarea-user-input").value;

        if (text.length > 0) {
            submitButton.classList.remove("hide");
            settingsButton.classList.add("hide");
        }
        else {
            submitButton.classList.add("hide");
            settingsButton.classList.remove("hide");
        }
    }

    function handleSubmit(event) {
        if (canSubmit(event)) {
            onSubmit(event);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                id="textarea-user-input"
                rows="1"
                placeholder="Send a message"
                value={inputValue}
                onChange={onInputChange}
                onKeyDown={handleKeyDown}
            />
            <button type="submit" className='chatbot-send-button' id='button-submit'>
                <i className="fas fa-paper-plane chatbot-send-icon"></i>
            </button>
            <button className="chatbot-settings-button" id='button-settings' onClick={(event) => {
                event.preventDefault();
                onSettings();
            }}>
                <i className="fas fa-cog"></i>
            </button>
        </form>
    );
}

TextInput.propTypes = {
    inputValue: PropTypes.string.isRequired,
    onInputChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    canSubmit: PropTypes.func.isRequired,
    onSettings: PropTypes.func.isRequired,
};

export default TextInput;