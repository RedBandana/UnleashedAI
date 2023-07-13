import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom'
import { authUser } from '../redux/selectors/authSelector';

export function RequireUser({ children }) {
    // const user = useSelector(authUser);
    const user = true;
    const location = useLocation();

    return user ? (
        children
    ) : (
        <Navigate to="/login" replace state={{ path: location.pathname }} />
    );
}