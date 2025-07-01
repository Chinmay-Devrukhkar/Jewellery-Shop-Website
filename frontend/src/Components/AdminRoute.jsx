import React,{useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext';

export const AdminRoute = () => {
    const { isAuthenticated, isAdmin, isLoading } = useUser();
    const navigate = useNavigate();
    
    useEffect(() => {
        // If authentication state has been determined
        if (!isLoading) {
        // Redirect unauthenticated users to login
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        
        // Redirect non-admin users to user dashboard
        if (!isAdmin) {
            navigate("/user");
            return;
        }
        }
    }, [isAuthenticated, isAdmin, isLoading, navigate]);

    if (isLoading) {
        return <div className="max-w-4xl mx-auto p-4 text-center">Loading...</div>;
      }
    
      // Only render children if user is authenticated and is an admin
      return isAuthenticated && isAdmin ? children : null;
}
