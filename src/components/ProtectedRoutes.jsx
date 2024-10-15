import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getRoleFromToken } from '../utils/jwtDecode';  // Assuming this function decodes JWT
import axios from 'axios';
import { API_USER_URL } from '../constants';

const ProtectedRoute = ({ children, requiredRole }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    const refreshToken = localStorage.getItem('refresh_token');
    let token = localStorage.getItem('token');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // If refresh token is not present, redirect to login
                if (!refreshToken) {
                    localStorage.removeItem("token");  // Clean up any stale token
                    setShouldRedirect(true);
                    return;
                }

                // If token is present, check if it is expired
                if (token) {
                    const { role, isExpired } = getRoleFromToken(token);
                    if (!isExpired) {
                        // Token is valid, set the user role and mark as authenticated
                        setUserRole(role);
                        setIsAuthenticated(true);
                        setIsLoading(false);
                        return;
                    }
                }

                // If token is missing or expired, try to refresh it
                if (refreshToken) {
                    const response = await axios.get(`${API_USER_URL}/refresh`,  {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`,
                        },
                    });

                    console.log("Getting new access token using refresh token:", refreshToken);

                    const { token: newToken } = response.data;

                    // If the refresh was successful, store the new token
                    localStorage.setItem('token', newToken);

                    // Decode the new token to get the role and mark as authenticated
                    const { role } = getRoleFromToken(newToken);
                    setUserRole(role);
                    setIsAuthenticated(true);
                } else {
                    // If refresh token is invalid, redirect to login
                    setShouldRedirect(true);
                }
            } catch (error) {
                console.error('Token refresh error:', error);
                // In case of any error, redirect to login
                setShouldRedirect(true);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [refreshToken, token]);

    // Show a loading spinner while the authentication check is in progress
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Redirect to login if necessary
    if (shouldRedirect) {
        return <Navigate to="/login" />;
    }

    // Redirect based on user role if authenticated but role does not match
    if (isAuthenticated && userRole !== requiredRole) {
        return userRole === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/user/home" />;
    }

    return children;
};

export default ProtectedRoute;
