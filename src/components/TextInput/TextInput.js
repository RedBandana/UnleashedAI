import React from 'react';
import PropTypes from 'prop-types';
import './TextInput.css';

function TextInput({ inputValue, onInputChange, onSubmit, canSubmit, onSettings }) {
    return (
        <form onSubmit={onSubmit}>
            <textarea
                id="textarea-user-input"
                rows="1"
                placeholder="Type your message here..."
                value={inputValue}
                onChange={onInputChange}
                onKeyDown={(event) => {
                    if (canSubmit(event)) {
                        onSubmit(event);
                    }
                }}
            />
            <button type="submit" className='chatbot-send-button'>
                <i className="fas fa-paper-plane"></i>
            </button>
            <button className="chatbot-settings-button" onClick={(event) => {
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