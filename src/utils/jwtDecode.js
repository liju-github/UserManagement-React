import {jwtDecode} from 'jwt-decode';

export const getRoleFromToken = (token) => {
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.role || null;
    } catch (error) {
        localStorage.removeItem('token');
        console.error('Invalid token:', error);
        return null;
    }
};
