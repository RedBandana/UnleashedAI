import { Navigate, useLocation } from 'react-router-dom'


export function RequireUser({ children }) {
    const user = true;
    const location = useLocation();

    return user ? (
        children
    ) : (
        <Navigate to="/login" replace state={{ path: location.pathname }} />
    );
}