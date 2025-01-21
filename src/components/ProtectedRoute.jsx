import React, { useEffect } from 'react';
import { isAuthenticated, getRole } from '../utils/Auth';
import UserContext from '../utils/UserContext';
import { Navigate, useNavigate } from 'react-router-dom';

function ProtectedRoute({children, requiredRole}) {
    const isAuth = isAuthenticated();
    const userRole = getRole();
    const {logUser, setLogUser} = React.useContext(UserContext);
    const navigate = useNavigate();
    
    // Check if the user is authenticated and has the required role
    if(!isAuth || (requiredRole && userRole !== requiredRole)) {
        setLogUser(null);
        localStorage.removeItem('token');
        return <Navigate to="/authenticate/signin" replace />;
    }

    useEffect(() => {
        // Ensure logUser is defined before accessing its properties
        const timeoutId = setTimeout(() => {
            const user = localStorage.getItem('logUser');

            if(userRole === "Intern") {
                const notAllowedPathsForIntern = [
                    '/intern/projects', 
                    '/intern/attendance/'
                ];
            }
        }, 500);// Adjust the timeout duration as needed
        return () => clearTimeout(timeoutId);
    }, [userRole, logUser, navigate]);
    return children;
}

export default ProtectedRoute