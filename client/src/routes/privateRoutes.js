import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom'
import { authUser } from '../redux/selectors/authSelectors';

export function RequireUser({ children }) {
    const user = useSelector(authUser);
    const location = useLocation();

    return user ? (
        children
    ) : (
        <Navigate to="/login" replace state={{ path: location.pathname }} />
    );
}