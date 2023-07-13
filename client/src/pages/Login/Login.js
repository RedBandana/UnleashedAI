import { useSelector, useDispatch } from 'react-redux';
import { loginRequest } from '../../redux/actions/authActions';
import { getUser } from '../../redux/actions/userActions';
import { authUser, authUserLoading, authUserError } from '../../redux/selectors/authSelectors';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function LoginPage() {
  const user = useSelector(authUser);
  const loading = useSelector(authUserLoading);
  const error = useSelector(authUserError);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleLogin = () => {
    // Dispatch the login request action
    dispatch(loginRequest());
  };

  useEffect(() => {
    if (user) {
      // Dispatch an action to fetch additional user data
      dispatch(getUser(user));
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