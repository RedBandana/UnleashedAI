import { useSelector } from 'react-redux';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { fetchUserValue } from '../redux/selectors/userSelectors';


export function RequireUser({ children }) {
   
    const location = useLocation();
    const user = useSelector(fetchUserValue);

    return user ? (
        children
    ) : (
        <Navigate to="/login" replace state={{ path: location.pathname }} />
    );
}