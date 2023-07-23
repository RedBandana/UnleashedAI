import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { createGuest, getCurrentUser } from '../../services/userService';
import { createGuestFailure, createGuestSuccess } from '../../redux/actions/userActions';
import { useEffect, useState } from 'react';
import { TOKEN_LIFESPAN } from '../../utils/constants';
import { getCookie } from '../../utils/functions';
import { createGuestError } from '../../redux/selectors/userSelectors';
import { getThemeIsLight } from '../../redux/selectors/uiSelectors';
import { setThemeIsLight } from '../../redux/actions/uiActions';
import Loading from '../../components/Loading/Loading';

import './Login.scss';


function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const themeIsLight = useSelector(getThemeIsLight);
  const error = useSelector(createGuestError);

  const [themeIsInitialized, setThemeIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('rendering');

    const savedThemeIsLight = localStorage.getItem("themeIsLight");
    dispatch(setThemeIsLight(savedThemeIsLight === "true"));
    setThemeIsInitialized(true);

    const token = getCookie('sessionToken');
    if (token) {
      getUserSession();
    }
    else {
      createGuestSession();
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

  function getUserSession() {
    console.log('getUserSession');
    setLoading(true);
    getCurrentUser().then((user) => {
      onUserConnected(user);
    })
  }

  function createGuestSession() {
    console.log('createGuestSession');
    setLoading(true);
    createGuest().then((guest) => {
      if (!guest.sessionToken) {
        dispatch(createGuestFailure(guest));
        return;
      }

      createGuestSessionCookie(guest.sessionToken);
      onUserConnected(guest);
    })
  };

  function onUserConnected(user) {
    delete user.sessionToken;
    dispatch(createGuestSuccess(user));
    navigate(state?.path || "/");
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
      {error && (
        <div className='login-error'>
          Error: {error.message}
        </div>
      )}
      {false && (
        <div className='login-button-container'>
          <button className='login-button' onClick={createGuestSession}>Try Now</button>
        </div>
      )}
      {
        loading && (
          <div className='login-loading'>
            Creating a guest session...
            <Loading />
          </div>
        )
      }
    </div>
  );
}

export default LoginPage;