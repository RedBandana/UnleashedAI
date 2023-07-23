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
    if (process.env.REACT_APP_NODE_ENV === 'development') {
      createUserSessionCookie(token);
    }
    else {
      document.cookie = `sessionToken=${token}; path=/; secure; SameSite=Strict; Expires=0;`;
    }
  }

  return (
    <div className={`login ${themeIsLight ? 'theme-light' : 'theme-dark'}`}>
      <div className='login-button-container'>
        <button className='login-button' onClick={handleSession}>Try now</button>
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
    </div>
  );
}

export default LoginPage;