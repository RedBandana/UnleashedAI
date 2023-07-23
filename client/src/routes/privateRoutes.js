import { Navigate, useLocation } from 'react-router-dom'
import { getCookie } from '../utils/functions';


export function RequireUser({ children }) {
    const location = useLocation();

    return getCookie('sessionToken') ? (
        children
    ) : (
        <Navigate to="/login" replace state={{ path: location.pathname }} />
    );
}