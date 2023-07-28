import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { createGuest, getCurrentUser } from '../../services/userService';
import { createGuestFailure, createGuestSuccess } from '../../redux/actions/userActions';
import { useEffect, useState } from 'react';
import { TOKEN_LIFESPAN } from '../../utils/constants';
import { getCookie } from '../../utils/functions';
import { getThemeIsLight } from '../../redux/selectors/uiSelectors';
import { setThemeIsLight } from '../../redux/actions/uiActions';
import Loading from '../../components/Loading/Loading';

import './Login.scss';


function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const themeIsLight = useSelector(getThemeIsLight);

  const [themeIsInitialized, setThemeIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleToggleSignUp = () => {
    setIsSignUp(!isSignUp);
  };

  const handleLogin = () => {
    // Send email and password to server for login
    console.log('Logging in with:', email, password);
  };

  const handleSignUp = () => {
    // Send email, password, and confirmPassword to server for sign up
    console.log('Signing up with:', email, password, confirmPassword);
  };

  const handleFocus = (event) => {
    event.target.parentNode.classList.add('active');
  };

  const handleBlur = (event) => {
    if (event.target.value === '') {
      event.target.parentNode.classList.remove('active');
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    const savedThemeIsLight = localStorage.getItem("themeIsLight");
    dispatch(setThemeIsLight(savedThemeIsLight === "true"));
    setThemeIsInitialized(true);

    const shouldConnectAndRedirect = state?.path;
    if (shouldConnectAndRedirect) {
      handleSession();
    }
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

  function handleSession() {
    const token = getCookie('sessionToken');
    if (token) {
      getUserSession();
    }
    else {
      createGuestSession();
    }
  }

  function getUserSession() {
    setLoading(true);
    getCurrentUser().then((user) => {
      onUserConnected(user);
    })
      .catch((error) => {
        onError(error);
      });
  }

  function createGuestSession() {
    setLoading(true);
    createGuest().then((guest) => {
      if (!guest.sessionToken) {
        dispatch(createGuestFailure(guest));
        return;
      }

      createGuestSessionCookie(guest.sessionToken);
      onUserConnected(guest);
    })
      .catch((error) => {
        onError(error);
      });
  };

  function onUserConnected(user) {
    delete user.sessionToken;
    dispatch(createGuestSuccess(user));
    navigate(state?.path || "/");
  }

  function onError(error) {
    setError(error.message);
    setLoading(false);
  }

  function createUserSessionCookie(token) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + TOKEN_LIFESPAN);
    document.cookie = `sessionToken=${token}; path=/; secure; SameSite=Strict; Expires=${expiryDate.toUTCString()};`;
  }

  function createGuestSessionCookie(token) {
    document.cookie = `sessionToken=${token}; path=/; secure; SameSite=Strict; Expires=0;`;
  }

  return (
    <div className={`login ${themeIsLight ? 'theme-light' : 'theme-dark'}`}>
      <div className="login-page">
        <div className="login-container">
          <h1 className='login-title'>Unleashed AI</h1>
          <div className="form-container">
            <div className={`form-group ${email ? 'active' : ''}`}>
              <input className='login-input'
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <label className='login-label' htmlFor="email">Email address</label>
            </div>

            <div className={`form-group ${password ? 'active' : ''}`}>
              <input className='login-input'
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <label className='login-label' htmlFor="password">Password</label>
              <div className="password-toggle" onClick={handleShowPassword}>
                {showPassword ? (
                  <i className="fas fa-eye-slash"></i>
                ) : (
                  <i className="fas fa-eye"></i>
                )}
              </div>
            </div>

            {!isSignUp && (
              <div className='login-form login-links'>
                <a>Forgot password?</a>
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
                />
                <label className='login-label' htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-toggle" onClick={handleShowConfirmPassword}>
                  {showConfirmPassword ? (
                    <i className="fas fa-eye-slash"></i>
                  ) : (
                    <i className="fas fa-eye"></i>
                  )}
                </div>
              </div>
            )}

            <button className='login-button' onClick={isSignUp ? handleSignUp : handleLogin}>
              {isSignUp ? 'Sign up' : 'Login'}
            </button>
          </div>

          <div className="toggle-container">
            <div>{isSignUp ? 'Already have an account?' : "Don't have an account?"}</div>
            <button className='login-button-second' onClick={handleToggleSignUp}>
              {isSignUp ? 'Login' : 'Sign up'}
            </button>
          </div>
        </div>
      </div>
      <div className='login-button-container'>
        <button className='login-button' onClick={handleSession}>Try as guest</button>
        <div className='login-button-text'>
          Experience the limitless possibilities of ChatGPT and discover the true potential behind personalized queries.
        </div>
      </div>
      {
        loading && (
          <div className='login-loading'>
            <Loading />
            Creating a guest session
          </div>
        )
      }
      {error && (
        <div className='login-error'>
          {error}
        </div>
      )}
      <footer class="login-footer">
        <div class="login-links">
          <a href="/policies/terms-of-use">Terms of use</a>
          <span>|</span>
          <a href="/policies/privacy-policy">Privacy policy</a>
        </div>
      </footer>
    </div>
  );
}

export default LoginPage;