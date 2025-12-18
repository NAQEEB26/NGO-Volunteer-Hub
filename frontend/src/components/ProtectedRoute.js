import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protected Route component - requires authentication
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check for role-based access
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // Redirect to appropriate dashboard based on role
        if (user?.role === 'ngo') {
            return <Navigate to="/ngo/dashboard" replace />;
        } else {
            return <Navigate to="/volunteer/dashboard" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
