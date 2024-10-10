import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of Navigate
import { logout } from '../../store/auth/authSlice';

const LogoutButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize the useNavigate hook
    const { loading, error } = useSelector((state) => state.userAuth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login'); // Redirect to the login page after logout
    };

    return (
        <div>
            <button onClick={handleLogout} disabled={loading} style={{
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
            }}>
                {loading ? 'Logging out...' : 'Logout'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default LogoutButton;
