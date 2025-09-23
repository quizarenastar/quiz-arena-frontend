import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated } = useSelector((s) => s.auth);
    const location = useLocation();

    if (!isAuthenticated) {
        toast.error('You must be logged in to access this page', {
            duration: 4000,
            position: 'top-center',
        });
        return <Navigate to='/login' replace state={{ from: location }} />;
    }

    return children;
}
