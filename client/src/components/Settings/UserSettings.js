import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import './UserSettings.scss';
import { getThemeIsLight, getUserSettingsIsOpen } from '../../redux/selectors/uiSelectors';
import { setThemeIsLight, setUserSettingsIsOpen } from '../../redux/actions/uiActions';
import { clearChatsRequest } from '../../redux/actions/chatActions';
import { clearMessagesSuccess } from '../../redux/actions/messageActions';
import AlertDialog from '../AlertDialog/AlertDialog';
import AccountSettings from './AccountSettings';
import { fetchUserValue } from '../../redux/selectors/userSelectors';

const UserSettings = () => {
    const showDialog = useSelector(getUserSettingsIsOpen);
    const isLightTheme = useSelector(getThemeIsLight);
    const dispatch = useDispatch();

    const [showAccountSettings, setShowAccountSettings] = useState(false);
    const [showAlertDialog, setShowAlertDialog] = useState(false);
    const [settingsTheme, setSettingsTheme] = useState('')

    const user = useSelector(fetchUserValue);

    useEffect(() => {
        function handleClickOutside(event) {
            if (event.target.parentElement?.className.includes("alert-dialog")) {
                setShowAlertDialog(false);
            }

            if (event.target.className.includes("user-settings-main-box")) {
                dispatch(setUserSettingsIsOpen(false));
            }

            if (!event.target.className.includes("user-settings-account") &&
                !event.target.className.includes("user-settings-persist") &&
                !event.target.parentElement?.className.includes("user-settings-account")) {
                setShowAccountSettings(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [])

    useEffect(() => {
        if (isLightTheme) {
            setSettingsTheme('light');
        }
        else {
            setSettingsTheme('dark');
        }
    }, [isLightTheme])

    if (!showDialog) {
        return null;
    }

    function handleInputChange(event) {
    };

    function handleThemeChange(event) {
        const { value } = event.target;

        if (value === 'light') {
            dispatch(setThemeIsLight(true));
        }
        else if (value === 'dark') {
            dispatch(setThemeIsLight(false));
        }
    }

    function tryHandleOnClear() {
        setShowAlertDialog(true);
    }

    function handleOnClearItems() {
        dispatch(clearChatsRequest());
        dispatch(clearMessagesSuccess());
        dispatch(setUserSettingsIsOpen(false));
    }

    function handleAlertNo() {

    }

    function handleSettings() {
        setShowAccountSettings(true);
    }

    return (
        <div className='user-settings dialog'>
            {showAlertDialog && (
                <AlertDialog title={'confirmation'} text='Are you sure you want to clear all chats?'
                    onClose={() => { setShowAlertDialog(false) }}
                    onYes={handleOnClearItems} onNo={handleAlertNo} />
            )}
            <div className="main-box user-settings-main-box">
                <div className="main-box-container dialog-container">
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
                                        value={settingsTheme}
                                        onChange={handleThemeChange}>
                                        <option value="light">light</option>
                                        <option value="dark">dark</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='main-box-body-row hide'>
                            <div className='main-box-body-row-item'>manage roles</div>
                            <div className='main-box-body-row-item-action'>
                                <button className="user-settings-account-button" onClick={handleInputChange}>
                                    manage
                                </button>
                            </div>
                        </div>
                        <div className='main-box-body-row hide'>
                            <div className='main-box-body-row-item'>set default settings</div>
                            <div className='main-box-body-row-item-action'>
                                <button className="user-settings-account-button" onClick={handleInputChange}>
                                    set
                                </button>
                            </div>
                        </div>
                        {user?.type !== 0 && (
                            <div className='main-box-body-row'>
                                <div className='main-box-body-row-item'>manage account</div>
                                <div className='main-box-body-row-item-action'>
                                    <button className="user-settings-account-button" onClick={handleSettings}>
                                        manage
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className='main-box-body-row'>
                            <div className='main-box-body-row-item'>clear all chats</div>
                            <div className='main-box-body-row-item-action'>
                                <div className='user-settings-clear'>
                                    <button className="user-settings-clear-button" onClick={tryHandleOnClear}>
                                        clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {showAccountSettings && (
                        <AccountSettings />
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserSettings;