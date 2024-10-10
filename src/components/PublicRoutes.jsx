
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getRoleFromToken } from '../utils/jwtDecode';

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('token'); 
    const role = getRoleFromToken(token); 

    
    if (token) {
        return role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/user/home" />;
    }

    
    return children;
};

export default PublicRoute;
