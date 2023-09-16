import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { createGuestRequest, fetchUserRequest, forgotPasswordRequest, loginUserRequest, logoutUserSuccess, registerUserRequest } from '../../redux/actions/userActions';
import { useEffect, useState } from 'react';
import { getCookie, validateEmail } from '../../utils/functions';
import { getThemeIsLight } from '../../redux/selectors/uiSelectors';
import { setIsMobile, setThemeIsLight } from '../../redux/actions/uiActions';
import Loading from '../../components/Loading/Loading';
import { Helmet } from "react-helmet";

import './Login.scss';
import { fetchUserEmailSent, fetchUserError, fetchUserLoading, fetchUserValue } from '../../redux/selectors/userSelectors';
import { Capacitor } from '@capacitor/core';
import { MOBILE_DEVICE_PATTERNS } from '../../utils/constants';
import { clearChatsSuccess } from '../../redux/actions/chatActions';
import Footer from '../../components/Footer/Footer';
import AlertDialog from '../../components/AlertDialog/AlertDialog';


function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const themeIsLight = useSelector(getThemeIsLight);
  const loading = useSelector(fetchUserLoading);
  const emailSent = useSelector(fetchUserEmailSent);
  const error = useSelector(fetchUserError);
  const user = useSelector(fetchUserValue);

  const [themeIsInitialized, setThemeIsInitialized] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  useEffect(() => {
    const isMobile = Capacitor.isNativePlatform() || MOBILE_DEVICE_PATTERNS.test(navigator.userAgent);
    dispatch(setIsMobile(isMobile));
    dispatch(logoutUserSuccess());
    dispatch(clearChatsSuccess());

    const savedThemeIsLight = localStorage.getItem("themeIsLight");
    if (savedThemeIsLight == null) {
      dispatch(setThemeIsLight(true));
      localStorage.setItem("themeIsLight", themeIsLight);
    }
    else {
      dispatch(setThemeIsLight(savedThemeIsLight === "true"));
    }
    setThemeIsInitialized(true);
  }, []);

  useEffect(() => {
    if (themeIsLight) {
      document.body.classList.remove("theme-dark");
    }
    else {
      document.body.classList.add("theme-dark");
    }

    if (themeIsInitialized) {
      localStorage.setItem("themeIsLight", themeIsLight);
    }
  }, [themeIsLight]);

  useEffect(() => {
    if (!user || !getCookie("sessionToken")) {
      return;
    }

    navigate(state?.path || "/chat");
  }, [user])

  useEffect(() => {
    setShowAlertDialog(emailSent);
  }, [emailSent])

  function handleEmailChange(event) {
    setEmail(event.target.value);
  };

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  };

  function handleConfirmPasswordChange(event) {
    setConfirmPassword(event.target.value);
  };

  function handleToggleSignUp() {
    setIsSignUp(!isSignUp);
  };

  function handleLogin() {
    if (!validateFieldsOnSubmit()) {
      return;
    }

    dispatch(loginUserRequest({ email, password }));
  };

  function handleSignUp() {
    if (!validateFieldsOnSubmit()) {
      return;
    }

    dispatch(registerUserRequest({ email, password }));
  };

  function handleCloseAlertDialog() {
    setShowAlertDialog(false);
  }

  function handleGuestSession() {
    dispatch(createGuestRequest());
  }

  function handleFocus(event) {
    event.target.parentNode.classList.add('active');
  };

  function handleBlur(event) {
    validateFieldsOnChange();

    if (event.target.value === '') {
      event.target.parentNode.classList.remove('active');
    }
  };

  function validateFieldsOnSubmit() {
    let success = true;

    if (!email) {
      success = false;
      setEmailError('Please fill out this field');
    }
    else if (!validateEmail(email)) {
      success = false;
      setEmailError('Email is not valid');
    }
    else {
      setEmailError('');
    }

    if (!password) {
      success = false;
      setPasswordError('Please fill out this field');
    }
    else {
      setPasswordError('');
    }

    if (isSignUp) {
      if (!confirmPassword) {
        success = false;
        setConfirmPasswordError('Please fill out this field');
      }
      else if (password !== confirmPassword) {
        success = false;
        setConfirmPasswordError('Passwords do not match');
      }
      else {
        setConfirmPasswordError('');
      }
    }

    return success;
  }

  function validateFieldsOnChange() {
    let success = true;

    if (email && !validateEmail(email)) {
      setEmailError('Email is not valid');
      success = false;
    }
    else {
      setEmailError('');
    }

    if (password) {
      setPasswordError('');
    }

    if (isSignUp && password && confirmPassword &&
      password !== confirmPassword) {
      success = false;
      setConfirmPasswordError('Passwords do not match');
    }
    else {
      setConfirmPasswordError('');
    }

    return success;
  }

  function handleShowPassword() {
    setShowPassword(!showPassword);
  };

  function handleShowConfirmPassword() {
    setShowConfirmPassword(!showConfirmPassword);
  };


  function handleKeyDown(event) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    if (isSignUp) {
      handleSignUp();
    }
    else {
      handleLogin();
    }
  }

  function handleForgotPassword() {
    if (!email) {
      setEmailError('Please fill out this field');
      return;
    }
    else if (!validateEmail(email)) {
      setEmailError('Email is not valid');
      return;
    }
    else {
      setEmailError('');
    }

    dispatch(forgotPasswordRequest({ email }));
  }

  return (
    <div className={`login ${themeIsLight ? 'theme-light' : 'theme-dark'}`}>
      <Helmet>
        <title>Log In | Unleashed AI Chat</title>
        <meta name="description" content="Login or sign up now to Unleashed AI. Experience the limitless possibilities of ChatGPT and discover the true potential behind personalized prompts with Unleashed AI." />
        <meta name="keywords" content="unleashed,ai,chat,chatbot,login,signup,register,signin" />
        <link rel="canonical" href="https://unleashedai.org/login" />
      </Helmet>
      {
        showAlertDialog && (
          <AlertDialog
            title="instructions sent"
            text={`We have sent instructions to change your password to **${email}**. Please verify your inbox and spam folder.`}
            onOk={handleCloseAlertDialog} onClose={handleCloseAlertDialog}
          />
        )
      }
      <div className="login-page">
        <div className="login-container">
          <h1 className='login-title '><a className='a-none' href='/'>Unleashed AI</a></h1>
          <section className="form-container">
            <div className={`form-group ${email ? 'active' : ''}`}>
              <input className='login-input'
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
              />
              <label className='login-label' htmlFor="email">Email address</label>
              {emailError && <div className="login-input-error">{emailError}</div>}
            </div>

            <div className={`form-group ${password ? 'active' : ''}`}>
              <input className='login-input'
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
              />
              <label className='login-label' htmlFor="password">Password</label>
              <div className="password-toggle" onClick={handleShowPassword}>
                {showPassword ? (
                  <i className="fas fa-eye-slash"></i>
                ) : (
                  <i className="fas fa-eye"></i>
                )}
              </div>
              {passwordError && <div className="login-input-error">{passwordError}</div>}
            </div>

            {!isSignUp && (
              <div className='login-form links-main hide'>
                <div className='login-button-second' onClick={handleForgotPassword}>Forgot password?</div>
              </div>
            )}
            {isSignUp && (
              <div className={`form-group ${confirmPassword ? 'active' : ''}`}>
                <input className='login-input'
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                />
                <label className='login-label' htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-toggle" onClick={handleShowConfirmPassword}>
                  {showConfirmPassword ? (
                    <i className="fas fa-eye-slash"></i>
                  ) : (
                    <i className="fas fa-eye"></i>
                  )}
                </div>
                {confirmPasswordError && <div className="login-input-error">{confirmPasswordError}</div>}
              </div>
            )}
            {error && (
              <div className='login-error'>
                {error}
              </div>
            )}
            <button className='login-button' onClick={isSignUp ? handleSignUp : handleLogin}>
              {isSignUp ? 'Sign up' : 'Log in'}
            </button>
          </section>
          <section className="toggle-container">
            <div>{isSignUp ? 'Already have an account?' : "Don't have an account?"}</div>
            <button className='login-button-second' onClick={handleToggleSignUp}>
              {isSignUp ? 'Login' : 'Sign up'}
            </button>
          </section>
        </div>
      </div>
      <section className='login-button-container'>
        <button className='login-button' onClick={handleGuestSession}>Try as guest</button>
        <h2 className='login-button-text'>
          Experience the limitless possibilities of ChatGPT and discover the true potential behind personalized prompts with Unleashed&nbsp;AI.
        </h2>
      </section>
      <Footer />
      {
        loading && (
          <div className='login-loading'>
            <Loading />
          </div>
        )
      }
    </div>
  );
}

export default LoginPage;