import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../redux/actions/authActions';
import { authUser } from '../../redux/selectors/authSelector';
import { useLocation, useNavigate } from 'react-router-dom';

function LoginPage() {
  // const user = useSelector(authUser);.
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleLogin = () => {
    // Dispatch the login request action
    // dispatch(login());
  };

  const onLogin = () => {
    navigate(state?.path || "/");
  }
  
  // if (user) {
  //   // Redirect to the chat page or another authenticated page
  //   // You can use react-router-dom's useHistory hook for redirection
  // }

  return (
    // Login page UI
    <button onClick={handleLogin}>Login</button>
  );
}

export default LoginPage;