import {jwtDecode} from 'jwt-decode';


export const getRoleFromToken = (token) => {
    if (!token) return { role: null, isExpired: true };

    try {
        const decoded = jwtDecode(token); 

        
        const currentTime = Math.floor(Date.now() / 1000);

        
        if (decoded.exp < currentTime) {
            return { role: null, isExpired: true }; 
        }

        
        return { role: decoded.role || null, isExpired: false }; 
    } catch (error) {
        
        localStorage.removeItem('token');
        console.error('Invalid token:', error);
        return { role: null, isExpired: true };
    }
};
