import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setSettings } from "../../redux/actions/uiActions";
import { fetchChatValue } from "../../redux/selectors/chatSelectors";
import { getSettings } from "../../redux/selectors/uiSelectors";

import { parseToRightType } from "../../utils/functions";
import "./ChatSettings.scss";

const Settings = () => {
    const dispatch = useDispatch();
    const chat = useSelector(fetchChatValue);
    const formSettings = useSelector(getSettings);

    const [isInitialized, setIsInitialize] = useState(false);

    useEffect(() => {
        if (!isInitialized && chat) {
            dispatch(setSettings(chat.settings));
            setIsInitialize(true);
        }
    }, [chat]);

    function handleInputChange(event) {
        const { name, value } = event.target;
        const finalValue = parseToRightType(formSettings, name, value);
        const finalSettings = { ...formSettings, [name]: finalValue }
        dispatch(setSettings(finalSettings));
    };

    function handleCheckboxChange(event) {
        const { name, checked } = event.target;
        const finalSettings = { ...formSettings, [name]: checked }
        dispatch(setSettings(finalSettings));
    }

    if (!formSettings) {
        return;
    }

    return (
        <div className="settings-dialog">
            <div className="settings-body">
                <form>
                    <div className="setting-inputs">
                        <div className="setting-item">
                            <label htmlFor="system">role</label>
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
                            <label htmlFor="model">model</label>
                            <div className="input-container">
                                <select
                                    id="model"
                                    name="model"
                                    value={formSettings.model}
                                    onChange={handleInputChange}>
                                    <option value="gpt-4">gpt-4</option>
                                    <option value="gpt-4-32k">gpt-4-32k</option>
                                    <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                                    <option value="gpt-3.5-turbo-16k">gpt-3.5-turbo-16k</option>
                                </select>
                            </div>
                        </div>
                        <div className="setting-item">
                            <label htmlFor="max_tokens">max words</label>
                            <div className="input-container">
                                <input
                                    type="number"
                                    id="max_tokens"
                                    name="max_tokens"
                                    min="0"
                                    max="4096"
                                    value={formSettings.max_tokens}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="setting-item">
                            <label htmlFor="n">answers</label>
                            <div className="input-container">
                                <input
                                    type="number"
                                    id="n"
                                    name="n"
                                    step="1"
                                    min="1"
                                    max="10"
                                    value={formSettings.n}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="setting-item">
                            <label htmlFor="temperature">randomize</label>
                            <div className="input-container">
                                <input
                                    type="number"
                                    id="temperature"
                                    name="temperature"
                                    step="0.1"
                                    min="0.1"
                                    max="2.0"
                                    value={formSettings.temperature}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="setting-item">
                            <label htmlFor="memory">memorize</label>
                            <div className="input-container">
                                <input
                                    type="number"
                                    id="memory"
                                    name="memory"
                                    step="1"
                                    min="1"
                                    max="100"
                                    value={formSettings.memory}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="setting-item dev-options">
                            <label htmlFor="devOptions">show advanced options</label>
                            <div className="input-container">
                                <input
                                    type="checkbox"
                                    id="devOptions"
                                    name="devOptions"
                                    checked={formSettings.devOptions}
                                    onChange={handleCheckboxChange}
                                />
                            </div>
                        </div>
                        <div className="dev-options-container" data-show-dev-options={formSettings.devOptions}>
                            <div className="settings-documentation links-main">
                                Documentation
                            </div>
                            <div className="setting-item">
                                <label htmlFor="top_p">top p</label>
                                <div className="input-container">
                                    <input
                                        type="number"
                                        id="top_p"
                                        name="top_p"
                                        step="0.1"
                                        min="0.1"
                                        max="1.0"
                                        value={formSettings.top_p}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="setting-item hide">
                                <label htmlFor="stream">stream*</label>
                                <div className="input-container">
                                    <input
                                        type="checkbox"
                                        id="stream"
                                        name="stream"
                                        checked={formSettings.stream}
                                        onChange={handleCheckboxChange}
                                    />
                                </div>
                            </div>
                            <div className="setting-item">
                                <label htmlFor="stop">stop sequences</label>
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
                                <label htmlFor="presence_penalty">presence penalty</label>
                                <div className="input-container">
                                    <input
                                        type="number"
                                        id="presence_penalty"
                                        name="presence_penalty"
                                        step="0.1"
                                        min="-2.0"
                                        max="2.0"
                                        value={formSettings.presence_penalty}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="setting-item">
                                <label htmlFor="frequency_penalty">frequency penalty</label>
                                <div className="input-container">
                                    <input
                                        type="number"
                                        id="frequency_penalty"
                                        name="frequency_penalty"
                                        step="0.1"
                                        min="-2.0"
                                        max="2.0"
                                        value={formSettings.frequency_penalty}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
