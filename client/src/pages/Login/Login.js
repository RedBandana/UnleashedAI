import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { createGuest, getCurrentUser } from '../../services/userService';
import { createGuestFailure, createGuestSuccess } from '../../redux/actions/userActions';
import { createGuestError } from '../../redux/selectors/userSelectors';
import { useState } from 'react';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [loading, setLoading] = useState(false);
  const error = useSelector(createGuestError);

  function handleLogin() {
    setLoading(true);

    const token = getSessionTokenFromCookie();
    console.log(token);

    if (token) {
      getCurrentUserWithToken(token);
    }
    else {
      createGuest();
    }
  };

  function createGuest() {
    createGuest().then((guest) => {
      if (!guest.sessionToken) {
        dispatch(createGuestFailure(guest));
        return;
      }

      document.cookie = `sessionToken=${guest.sessionToken}; path=/; secure; SameSite=Lax`;
      onUserConnected(guest);
    })
  }

  function getCurrentUserWithToken(token) {
    getCurrentUser(token).then((user) => {
      onUserConnected(user);
    })
  }

  function onUserConnected(user) {
    delete user.sessionToken;
    dispatch(createGuestSuccess(user));
    navigate(state?.path || "/");
  }

  function getSessionTokenFromCookie() {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      if (cookie.startsWith('sessionToken=')) {
        const sessionToken = cookie.substring('sessionToken='.length);
        return sessionToken;
      }
    }

    return null;
  };


  return (
    <div>
      {loading ? <p>Loading...</p> : null}
      {error ? <p>Error: {error.message}</p> : null}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;