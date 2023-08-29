import { useEffect, useState } from 'react';
import './AccountSettings.scss';
import { fetchUserError, fetchUserLoading, fetchUserUpdateDone, fetchUserValue } from '../../redux/selectors/userSelectors';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../Loading/Loading';
import { validateEmail } from '../../utils/functions';
import { updateUserRequest } from '../../redux/actions/userActions';


const AccountSettings = ({ text }) => {
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [currentPasswordError, setCurrentPasswordError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [requestDone, setRequestDone] = useState(false);

    const [changePassword, setChangePassword] = useState(false);
    const [canSave, setCanSave] = useState(false);

    const statusMessage = useSelector(fetchUserError);
    const statusSuccess = useSelector(fetchUserUpdateDone);
    const loading = useSelector(fetchUserLoading);
    const user = useSelector(fetchUserValue);

    useEffect(() => {
        setEmail(user.email);
        validateCanChange();
    }, [user]);

    useEffect(() => {
        validateCanChange();
    }, [email, currentPassword, password, confirmPassword, changePassword]);

    function handleShowCurrentPassword() {
        setShowCurrentPassword(!showCurrentPassword);
    }

    function handleShowPassword() {
        setShowPassword(!showPassword);
    };

    function handleShowConfirmPassword() {
        setShowConfirmPassword(!showConfirmPassword);
    };


    function handleEmailChange(event) {
        setEmail(event.target.value);
        setEmailError('');
    };

    function handleCurrentPasswordChange(event) {
        setCurrentPassword(event.target.value);
        setCurrentPasswordError('');
    };

    function handlePasswordChange(event) {
        setPassword(event.target.value);
        setPasswordError('');
    };

    function handleConfirmPasswordChange(event) {
        setConfirmPassword(event.target.value);
        setConfirmPasswordError('');
    };

    function handleCheckboxChange(event) {
        setChangePassword(event.target.checked);
    }

    function handleFocus(event) {
        event.target.parentNode.classList.add('active');
    };

    function handleBlur(event) {
        if (event.target.value === '') {
            event.target.parentNode.classList.remove('active');
        }
    };

    function handleKeyDown(event) {
        if (event.key !== "Enter") {
            return;
        }

        event.preventDefault();
    }

    function validateCanChange() {
        const canSaveFormBasis = email && currentPassword;
        if (changePassword) {
            const canSaveForm = canSaveFormBasis && password && confirmPassword;
            setCanSave(canSaveForm);
        }
        else {
            const canSaveForm = canSaveFormBasis && email !== user.email;
            setCanSave(canSaveForm);
        }
    }

    function validateCanSendRequest() {
        let noError = true;

        const emailIsOk = validateEmail(email);
        if (!emailIsOk) {
            setEmailError('Email is not valid');
            noError = false;
        }
        else {
            setEmailError('');
        }

        if (!currentPassword) {
            setCurrentPasswordError('Please fill out this field');
            noError = false;
        }
        else {
            setCurrentPasswordError('');
        }

        if (changePassword) {
            if (!password) {
                setPasswordError('Please fill out this field');
                noError = false;
            }
            else {
                setPasswordError('');
                if (password !== confirmPassword) {
                    setConfirmPasswordError('Passwords do not match');
                    noError = false;
                }
            }
        }
        else {
            setPasswordError('');
            setConfirmPasswordError('');
        }

        return noError;
    }

    function tryChangeAccount() {
        if (!canSave) {
            return;
        }

        setRequestDone(false);
        
        const canSendRequest = validateCanSendRequest();
        if (!canSendRequest) {
            return;
        }

        const updateRequest = {};
        updateRequest["password"] = currentPassword;

        if (email !== user.email) {
            updateRequest["newEmail"] = email;
        }

        if (changePassword) {
            updateRequest["newPassword"] = password;
        }

        dispatch(updateUserRequest(updateRequest));
        setRequestDone(true);
    }

    return (
        <div className="account-settings">
            <div className='main-box main-box-body-row-item-action'>
                <div className='user-settings-account-container user-settings-persist'>
                    <div className='main-box-header'>
                        <div className='main-box-title user-settings-persist'>account</div>
                    </div>
                    <div className='bordered-top'></div>
                    <div className="account-settings-item">
                        <div className={`input-container account-settings-form-group ${user?.email ? 'active' : ''}`}>
                            <input
                                type="email"
                                id="email"
                                className="account-settings-input user-settings-account"
                                value={email}
                                onChange={handleEmailChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                onKeyDown={handleKeyDown}
                            />
                            <label className='account-settings-account-settings-label' htmlFor="email">email address</label>
                            {emailError && <div className="account-settings-input-error">{emailError}</div>}
                        </div>
                    </div>
                    <div className="account-settings-item">
                        <div className={`input-container account-settings-form-group ${currentPassword ? 'active' : ''}`}>
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                id="password"
                                className="account-settings-input user-settings-account"
                                value={currentPassword}
                                onChange={handleCurrentPasswordChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                onKeyDown={handleKeyDown}
                            />
                            <label className='account-settings-account-settings-label' htmlFor="password">password</label>
                            <div className="password-toggle" onClick={handleShowCurrentPassword}>
                                {showCurrentPassword ? (
                                    <i className="fas fa-eye-slash user-settings-persist"></i>
                                ) : (
                                    <i className="fas fa-eye user-settings-persist"></i>
                                )}
                            </div>
                            {currentPasswordError && <div className="account-settings-input-error">{passwordError}</div>}
                        </div>
                    </div>
                    <div className="account-settings-item account-settings-change-password">
                        <div className='user-settings-persist'>
                            <input
                                type="checkbox"
                                id="change-password"
                                className='user-settings-persist'
                                checked={changePassword}
                                onChange={handleCheckboxChange}
                            />
                        </div>
                        <label className='user-settings-persist account-settings-change-password-label' htmlFor="change-password">change password</label>
                    </div>
                    {changePassword && (
                        <div className="account-settings-item">
                            <div className={`input-container account-settings-form-group ${password ? 'active' : ''}`}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="new-password"
                                    className="account-settings-input user-settings-account"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    onKeyDown={handleKeyDown}
                                />
                                <label className='account-settings-account-settings-label' htmlFor="new-password">new password</label>
                                <div className="password-toggle" onClick={handleShowPassword}>
                                    {showPassword ? (
                                        <i className="fas fa-eye-slash user-settings-persist"></i>
                                    ) : (
                                        <i className="fas fa-eye user-settings-persist"></i>
                                    )}
                                </div>
                                {passwordError && <div className="account-settings-input-error">{passwordError}</div>}
                            </div>
                        </div>
                    )}
                    {changePassword && (
                        <div className="account-settings-item">
                            <div className={`input-container account-settings-form-group ${confirmPassword ? 'active' : ''}`}>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirm-password"
                                    className="account-settings-input user-settings-account"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    onKeyDown={handleKeyDown}
                                />
                                <label className='account-settings-account-settings-label' htmlFor="confirm-password">confirm new password</label>
                                <div className="password-toggle" onClick={handleShowConfirmPassword}>
                                    {showConfirmPassword ? (
                                        <i className="fas fa-eye-slash user-settings-persist"></i>
                                    ) : (
                                        <i className="fas fa-eye user-settings-persist"></i>
                                    )}
                                </div>
                                {confirmPasswordError && <div className="account-settings-input-error">{confirmPasswordError}</div>}
                            </div>
                        </div>
                    )}

                    {statusMessage && (
                        <div className='account-settings-error'>
                            {statusMessage}
                        </div>
                    )}
                    {statusSuccess && requestDone && (
                        <div className='account-settings-error'>
                            {'Update done.'}
                        </div>
                    )}
                    {
                        loading && (
                            <div className='login-loading'>
                                <Loading />
                            </div>
                        )
                    }
                    <div className='main-box-body-row main-box-body-buttons-list'>
                        <button className={`main-box-body-row-button ${canSave ? '' : 'account-settings-inactive'} user-settings-persist`}
                            onClick={tryChangeAccount}>
                            save
                        </button>
                        <button className="main-box-body-row-button">
                            cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;