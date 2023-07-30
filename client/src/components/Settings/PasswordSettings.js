import { useState } from 'react';
import './PasswordSettings.scss';


const PasswordSettings = ({ text }) => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    function handleInputChange(event) {
    };

    function handleShowPassword() {
        setShowPassword(!showPassword);
    };
    
    function handleShowConfirmPassword() {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="password-settings">
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
                    <div className='main-box-body-row main-box-body-buttons-list'>
                        <button className="main-box-body-row-button" onClick={handleInputChange}>
                            confirm
                        </button>
                        <button className="main-box-body-row-button" onClick={handleInputChange}>
                            cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordSettings;