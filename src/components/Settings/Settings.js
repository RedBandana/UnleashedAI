import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Settings.css";
import { parseToRightType } from '../../utils/Utils'


const Settings = ({ settings, onSave, onClose }) => {
    const [formSettings, setFormSettings] = useState(settings);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        onSave(formSettings);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const finalValue = parseToRightType(formSettings, name, value);

        setFormSettings((prevState) => ({
            ...prevState,
            [name]: finalValue,
        }));
    };

    return (
        <div className="settings-dialog">
            <div className="settings-body">
                <form onSubmit={handleFormSubmit}>
                    <div className="setting-inputs">
                        <div className="setting-item">
                            <label htmlFor="system">Role</label>
                            <div className="input-container">
                                <textarea
                                    id="system"
                                    name="system"
                                    value={formSettings.system}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                        </div>
                        <div className="setting-item">
                            <label htmlFor="model">Model</label>
                            <div className="input-container">
                                <input
                                    type="text"
                                    id="model"
                                    name="model"
                                    value={formSettings.model}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="setting-item">
                            <label htmlFor="temperature">Temperature</label>
                            <div className="input-container">
                                <input
                                    type="number"
                                    id="temperature"
                                    name="temperature"
                                    step="0.1"
                                    min="0.1"
                                    max="1.0"
                                    value={formSettings.temperature}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="setting-item">
                            <label htmlFor="maxTokens">Max Words</label>
                            <div className="input-container">
                                <input
                                    type="number"
                                    id="maxTokens"
                                    name="maxTokens"
                                    min="0"
                                    max="4096"
                                    value={formSettings.maxTokens}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="setting-item">
                            <label htmlFor="quantity">Quantity</label>
                            <div className="input-container">
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    step="1"
                                    min="1"
                                    max="10"
                                    value={formSettings.quantity}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="setting-item">
                            <label htmlFor="user">User</label>
                            <div className="input-container">
                                <input
                                    type="text"
                                    id="user"
                                    name="user"
                                    value={formSettings.user}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="setting-item">
                            <label htmlFor="topP">Top P</label>
                            <div className="input-container">
                                <input
                                    type="number"
                                    id="topP"
                                    name="topP"
                                    step="0.1"
                                    min="0.1"
                                    max="1.0"
                                    value={formSettings.topP}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="setting-item">
                            <label htmlFor="stream">Stream*</label>
                            <div className="input-container">
                                <input
                                    type="checkbox"
                                    id="stream"
                                    name="stream"
                                    checked={formSettings.stream}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="setting-item">
                            <label htmlFor="stop">Stop Sequences</label>
                            <div className="input-container">
                                <input
                                    type="text"
                                    id="stop"
                                    name="stop"
                                    value={formSettings.stop}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="setting-item">
                            <label htmlFor="presencePenalty">Presence Penalty</label>
                            <div className="input-container">
                                <input
                                    type="number"
                                    id="presencePenalty"
                                    name="presencePenalty"
                                    step="0.1"
                                    min="-2.0"
                                    max="2.0"
                                    value={formSettings.presencePenalty}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="setting-item">
                            <label htmlFor="frequencyPenalty">Frequency Penalty</label>
                            <div className="input-container">
                                <input
                                    type="number"
                                    id="frequencyPenalty"
                                    name="frequencyPenalty"
                                    step="0.1"
                                    min="-2.0"
                                    max="2.0"
                                    value={formSettings.frequencyPenalty}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="settings-documentation">
                        <a href="https://platform.openai.com/docs/api-reference/chat" target="_blank" rel="noopener noreferrer">Documentation</a>
                    </div>
                    <div className="settings-buttons">
                        <button className="settings-cancel-button" onClick={onClose}>
                            <i className="fa fa-times"></i>
                        </button>
                        <button className="settings-save-button" type="submit">
                            <i className="fa fa-save"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

Settings.propTypes = {
    settings: PropTypes.shape({
        model: PropTypes.string.isRequired,
        system: PropTypes.string.isRequired,
        temperature: PropTypes.number.isRequired,
        topP: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
        stream: PropTypes.bool.isRequired,
        stop: PropTypes.string.isRequired,
        maxTokens: PropTypes.number.isRequired,
        presencePenalty: PropTypes.number.isRequired,
        frequencyPenalty: PropTypes.number.isRequired,
        user: PropTypes.string.isRequired,
    }).isRequired,
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Settings;
