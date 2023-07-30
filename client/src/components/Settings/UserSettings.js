import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import './UserSettings.scss';
import { getUserSettingsIsOpen } from '../../redux/selectors/uiSelectors';
import { setUserSettingsIsOpen } from '../../redux/actions/uiActions';

const UserSettings = ({ text }) => {
    const showDialog = useSelector(getUserSettingsIsOpen);
    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutsideTest);

        return () => {
            document.removeEventListener("mousedown", handleClickOutsideTest);
        };
    }, [])

    if (!showDialog) {
        return null;
    }

    function handleClickOutsideTest(event) {
        if (event.target.className === "main-box") {
            dispatch(setUserSettingsIsOpen(false));
        }
    }


    function handleInputChange(event) {
    };

    function handleShowPassword() {
        setShowPassword(!showPassword);
    };

    function handleShowConfirmPassword() {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className='user-settings'>
            <div className="main-box">
                <div className="main-box-container">
                    <div className='main-box-header'>
                        <div className='main-box-title'>settings</div>
                    </div>
                    <div className='bordered-top'></div>
                    <div className='main-box-body'>
                        <div className='main-box-body-row'>
                            <div className='main-box-body-row-item'>theme</div>
                            <div className='main-box-body-row-item-action'>
                                <div className='user-settings-theme'>
                                    <select
                                        className='user-settings-theme-select'
                                        id="theme"
                                        name="theme"
                                        value="system"
                                        onChange={handleInputChange}>
                                        <option value="system">system</option>
                                        <option value="dark">dark</option>
                                        <option value="light">light</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='main-box-body-row'>
                            <div className='main-box-body-row-item'>clear all chats</div>
                            <div className='main-box-body-row-item-action'>
                                <div className='user-settings-clear'>
                                    <button className="user-settings-clear-button" onClick={handleInputChange}>
                                        clear
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='main-box-body-row'>
                            <div className='main-box-body-row-item'>manage roles</div>
                            <div className='main-box-body-row-item-action'>
                                <button className="user-settings-password-button" onClick={handleInputChange}>
                                    manage
                                </button>
                            </div>
                        </div>
                        <div className='main-box-body-row'>
                            <div className='main-box-body-row-item'>set default settings</div>
                            <div className='main-box-body-row-item-action'>
                                <button className="user-settings-password-button" onClick={handleInputChange}>
                                    set
                                </button>
                            </div>
                        </div>
                        <div className='main-box-body-row'>
                            <div className='main-box-body-row-item'>change password</div>

                            <div className='main-box-body-row-item-action'>
                                <button className="user-settings-password-button" onClick={handleInputChange}>
                                    change
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='main-box-body-row-item-action'>
                <div className='user-settings-password-container'>
                    <div className="user-settings-item">
                        <div className="input-container">
                            <input
                                type="password"
                                id="current-password"
                                className="user-settings-password"
                                name="password"
                                placeholder='current password'
                            />
                        </div>
                    </div>
                    <div className="user-settings-item">
                        <div className="input-container">
                            <input
                                type="password"
                                id="new-password"
                                className="user-settings-password"
                                name="password"
                                placeholder='new password'
                            />
                        </div>
                    </div>
                    <div className="user-settings-item">
                        <div className="input-container">
                            <input
                                type="password"
                                id="confirm-password"
                                className="user-settings-password"
                                name="password"
                                placeholder='confirm password'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSettings;