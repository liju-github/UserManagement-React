import React from 'react';
import { Navigate } from 'react-router-dom';
import { getRoleFromToken } from '../utils/jwtDecode';

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const role = getRoleFromToken(token);

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (role !== requiredRole) {
        return role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/user/home" />;
    }

    return children;
};

export default ProtectedRoute;
