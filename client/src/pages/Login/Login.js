import { useSelector, useDispatch } from 'react-redux';
import { loginRequest } from '../../redux/actions/authActions';
import { authUser, authUserLoading, authUserError } from '../../redux/selectors/authSelectors';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchUser } from '../../services/userService';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  
  const user = useSelector(authUser);
  const loading = useSelector(authUserLoading);
  const error = useSelector(authUserError);

  const handleLogin = () => {
    // Dispatch the login request action
    dispatch(loginRequest());
  };

  useEffect(() => {
    if (user) {
      // Dispatch an action to fetch additional user data
      dispatch(fetchUser(user));
      navigate(state?.path || "/");
    }
  }, [user, dispatch, navigate, state]);

  return (
    // Login page UI
    <div>
      {loading ? <p>Loading...</p> : null}
      {error ? <p>Error: {error.message}</p> : null}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;