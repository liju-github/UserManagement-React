import React, { useEffect, useState } from 'react';
import LogoutButton from '../../components/LogoutButton/LogoutButton';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import UserUpdate from '../../components/UserUpdate/UserUpdate';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../store/auth/authSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.userCrud);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleUpdateSuccess = () => {
    dispatch(fetchUserProfile());
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: 'white',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        padding: '10px 0'
      }}>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Update User
        </button>
        <LogoutButton
        />
      </nav>
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {user && <ProfileCard user={user} />}
      </main>


      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <UserUpdate
            user={user}
            onClose={handleModalClose}
            onUpdateSuccess={handleUpdateSuccess}
          />
        </div>
      )}
    </div>
  );
};

export default Home;