import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/auth/authSlice';
import toast from 'react-hot-toast';
import ConfirmationModal from '../ConfirmatonModal/ConfirmationModal'; 

const LogoutButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.userAuth);
    const [showModal, setShowModal] = useState(false); 

    const handleLogoutConfirm = () => {
        dispatch(logout());
        toast.success("Logout Successful", {
            position: "top-right",
            duration: 2000
        });
        navigate('/login');
        setShowModal(false); 
    };

    const handleLogout = () => {
        setShowModal(true); 
    };

    const handleCancel = () => {
        setShowModal(false); 
    };

    return (
        <div>
            <button
                onClick={handleLogout}
                disabled={loading}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? 'Logging out...' : 'Logout'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {showModal && (
                <ConfirmationModal
                    message="Are you sure you want to log out?"
                    onConfirm={handleLogoutConfirm}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
};

export default LogoutButton;
