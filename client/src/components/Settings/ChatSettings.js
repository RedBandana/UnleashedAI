import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setSettings } from "../../redux/actions/uiActions";
import { fetchChatValue } from "../../redux/selectors/chatSelectors";
import { getSettings } from "../../redux/selectors/uiSelectors";

import { getModelMaxTokens, isValidNumber, parseToRightType } from "../../utils/functions";
import "./ChatSettings.scss";
import { fetchUserValue } from "../../redux/selectors/userSelectors";

const Settings = () => {
    const dispatch = useDispatch();
    const chat = useSelector(fetchChatValue);
    const formSettings = useSelector(getSettings);
    const user = useSelector(fetchUserValue);

    const [isInitialized, setIsInitialize] = useState(false);
    const settingInputsRef = useRef(null);

    const defaultToken = 0;
    const minTokens = 0;
    const [maxTokens, setMaxTokens] = useState(0);
    const defaultAnswers = 1;
    const minAnswers = 1;
    const maxAnswers = 10;
    const defaultMemory = 10;
    const minMemory = 1;
    const [maxMemory, setMaxMemory] = useState(100);
    const defaultTemperature = 1;
    const minTemperature = 0.1;
    const maxTemperature = 2;
    const defaultTopP = 1;
    const minTopP = 0.1;
    const maxTopP = 1;
    const defaultPresencePenalty = 0;
    const minPresencePenalty = -2;
    const maxPresencePenalty = 2;
    const defaultFrequencePenalty = 0;
    const minFrequencePenalty = -2;
    const maxFrequencePenalty = 2;

    useEffect(() => {
        if (!isInitialized && chat) {
            dispatch(setSettings(chat.settings));
            setMaxTokens(getModelMaxTokens(chat.settings.model));
            setIsInitialize(true);
        }

        if (isInitialized) {
            validateNull();
        }

    }, [chat, isInitialized]);

    useEffect(() => {
        validateMaxTokens();
    }, [maxTokens]);

    useEffect(() => {
        if (!formSettings) {
            return;
        }

        if (isInitialized && formSettings.devOptions) {
            scrollToBottom();
        }
    }, [formSettings?.devOptions])

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

    function handleModelChange(event) {
        setMaxTokens(getModelMaxTokens(event.target.value));
        handleInputChange(event);
    }

    function handleMaxTokenChange(event) {
        if (!validateMaxTokens(event.target.value)) {
            return;
        }
        handleInputChange(event);
    }

    function handleAnswersChange(event) {
        if (!validateAnswers(event.target.value)) {
            return;
        }
        handleInputChange(event);
    }

    function handleMemoryChange(event) {
        if (!validateMemory(event.target.value)) {
            return;
        }
        handleInputChange(event);
    }

    function handleTemperatureChange(event) {
        if (!validateTemperature(event.target.value)) {
            return;
        }
        handleInputChange(event);
    }

    function handleDevOptionsChange(event) {
        handleCheckboxChange(event);
    }

    function scrollToBottom() {
        settingInputsRef.current.scrollTo({
            top: settingInputsRef.current.scrollHeight,
            behavior: "smooth",
        });
    }

    function handleTopPChange(event) {
        if (!validateTopP(event.target.value)) {
            return;
        }
        handleInputChange(event);
    }

    function handlePresencePenaltyChange(event) {
        if (!validatePresencePenalty(event.target.value)) {
            return;
        }
        handleInputChange(event);
    }

    function handleFrequencePenaltyChange(event) {
        if (!validateFrequencePenalty(event.target.value)) {
            return;
        }
        handleInputChange(event);
    }

    function validateMaxTokens(value) {
        if (!value) {
            return true;
        }

        if (value < minTokens) {
            const finalSettings = { ...formSettings, ['max_tokens']: minTokens }
            dispatch(setSettings(finalSettings));
            return false;
        }
        else if (maxTokens != 0 && value > maxTokens) {
            const finalSettings = { ...formSettings, ['max_tokens']: maxTokens }
            dispatch(setSettings(finalSettings));
            return false;
        }

        return true;
    }

    function validateAnswers(value) {
        if (!value) {
            return true;
        }

        if (value < minAnswers) {
            const finalSettings = { ...formSettings, ['n']: minAnswers }
            dispatch(setSettings(finalSettings));
            return false;
        }
        else if (maxAnswers != 0 && value > maxAnswers) {
            const finalSettings = { ...formSettings, ['n']: maxAnswers }
            dispatch(setSettings(finalSettings));
            return false;
        }

        return true;
    }

    function validateMemory(value) {
        if (!value) {
            return true;
        }

        if (value < minMemory) {
            const finalSettings = { ...formSettings, ['memory']: minMemory }
            dispatch(setSettings(finalSettings));
            return false;
        }
        else if (maxMemory != 0 && value > maxMemory) {
            const finalSettings = { ...formSettings, ['memory']: maxMemory }
            dispatch(setSettings(finalSettings));
            return false;
        }

        return true;
    }

    function validateTopP(value) {
        if (!value) {
            return true;
        }

        if (value < minTopP) {
            const finalSettings = { ...formSettings, ['top_p']: minTopP }
            dispatch(setSettings(finalSettings));
            return false;
        }
        else if (maxTopP != 0 && value > maxTopP) {
            const finalSettings = { ...formSettings, ['top_p']: maxTopP }
            dispatch(setSettings(finalSettings));
            return false;
        }

        return true;
    }

    function validatePresencePenalty(value) {
        if (!value) {
            return true;
        }

        if (value < minPresencePenalty) {
            const finalSettings = { ...formSettings, ['presence_penalty']: minPresencePenalty }
            dispatch(setSettings(finalSettings));
            return false;
        }
        else if (maxPresencePenalty != 0 && value > maxPresencePenalty) {
            const finalSettings = { ...formSettings, ['presence_penalty']: maxPresencePenalty }
            dispatch(setSettings(finalSettings));
            return false;
        }

        return true;
    }

    function validateFrequencePenalty(value) {
        if (!value) {
            return true;
        }

        if (value < minFrequencePenalty) {
            const finalSettings = { ...formSettings, ['frequency_penalty']: minFrequencePenalty }
            dispatch(setSettings(finalSettings));
            return false;
        }
        else if (maxFrequencePenalty != 0 && value > maxFrequencePenalty) {
            const finalSettings = { ...formSettings, ['frequency_penalty']: maxFrequencePenalty }
            dispatch(setSettings(finalSettings));
            return false;
        }

        return true;
    }

    function validateTemperature(value) {
        if (!value) {
            return true;
        }

        if (value < minTemperature) {
            const finalSettings = { ...formSettings, ['temperature']: minTemperature }
            dispatch(setSettings(finalSettings));
            return false;
        }
        else if (maxTemperature != 0 && value > maxTemperature) {
            const finalSettings = { ...formSettings, ['temperature']: maxTemperature }
            dispatch(setSettings(finalSettings));
            return false;
        }

        return true;
    }

    function validateNull() {
        if (!formSettings) {
            return;
        }
        const finalSettings = { ...formSettings };

        if (!isValidNumber(formSettings.max_tokens)) {
            finalSettings['max_tokens'] = defaultToken;
        }

        if (!isValidNumber(formSettings.n)) {
            finalSettings['n'] = defaultAnswers;
        }

        if (!isValidNumber(formSettings.memory)) {
            finalSettings['memory'] = defaultMemory;
        }

        if (!isValidNumber(formSettings.temperature)) {
            finalSettings['temperature'] = defaultTemperature;
        }

        if (!isValidNumber(formSettings.top_p)) {
            finalSettings['top_p'] = defaultTopP;
        }

        if (!isValidNumber(formSettings.presence_penalty)) {
            finalSettings['presence_penalty'] = defaultPresencePenalty;
        }

        if (!isValidNumber(formSettings.frequency_penalty)) {
            finalSettings['frequency_penalty'] = defaultFrequencePenalty;
        }

        dispatch(setSettings(finalSettings));
    }

    function getTemperaturePercent() {
        if (!formSettings) {
            return;
        }
        const value = formSettings.temperature * 10 * 5;
        return value;
    }

    if (!formSettings) {
        return;
    }

    return (
        <div className="settings-dialog">
            <div className="settings-body">
                <form>
                    <div className="setting-inputs" ref={settingInputsRef} >
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
                                    onChange={handleModelChange}>
                                    <option value="gpt-4-1106-preview">GPT-4 Turbo</option>
                                    <option value="gpt-4-vision-preview">GPT-4 Turbo with vision</option>
                                    <option value="gpt-4">GPT-4</option>
                                    <option value="gpt-4-32k">GPT-4 32k</option>
                                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                    <option value="gpt-3.5-turbo-16k">GPT-3.5 Turbo 16k</option>
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
                                    step="1"
                                    min={`${minTokens}`}
                                    max={`${maxTokens}`}
                                    value={formSettings.max_tokens}
                                    onChange={handleMaxTokenChange}
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
                                    min={`${minAnswers}`}
                                    max={`${maxAnswers}`}
                                    value={formSettings.n}
                                    onChange={handleAnswersChange}
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
                                    min={`${minMemory}`}
                                    max={`${maxMemory}`}
                                    value={formSettings.memory}
                                    onChange={handleMemoryChange}
                                />
                            </div>
                        </div>
                        <div className="setting-item">
                            <label htmlFor="temperature">randomize</label>
                            <div className="input-container">
                                <div className="input-range-value">
                                    {getTemperaturePercent()}
                                </div>
                                <input
                                    type="range"
                                    id="temperature"
                                    name="temperature"
                                    step="0.1"
                                    min={`${minTemperature}`}
                                    max={`${maxTemperature}`}
                                    value={formSettings.temperature}
                                    onChange={handleTemperatureChange}
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
                                    onChange={handleDevOptionsChange}
                                />
                            </div>
                        </div>
                        <div className="dev-options-container" data-show-dev-options={formSettings.devOptions}>
                            <div className="settings-documentation links-main">
                                <div className="hide">Documentation</div>
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
                                <label htmlFor="top_p">top p</label>
                                <div className="input-container">
                                    <input
                                        type="number"
                                        id="top_p"
                                        name="top_p"
                                        step="0.1"
                                        min={`${minTopP}`}
                                        max={`${maxTopP}`}
                                        value={formSettings.top_p}
                                        onChange={handleTopPChange}
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
                                        min={`${minPresencePenalty}`}
                                        max={`${maxPresencePenalty}`}
                                        value={formSettings.presence_penalty}
                                        onChange={handlePresencePenaltyChange}
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
                                        min={`${minFrequencePenalty}`}
                                        max={`${maxFrequencePenalty}`}
                                        value={formSettings.frequency_penalty}
                                        onChange={handleFrequencePenaltyChange}
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
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
