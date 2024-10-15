import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa'; // Import spinner icon
import LogoutButton from '../../components/LogoutButton/LogoutButton';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import UserUpdate from '../../components/UserUpdate/UserUpdate';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../store/auth/authSlice';
import styles from './UserHome.module.css';

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

  return (
    <div>
      {loading && (
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.spinnerIcon} />
        </div>
      )}

      <div className={loading ? styles.contentBlurred : ''}>
        <nav className={styles.navbar}>
          <button
            onClick={() => setIsModalOpen(true)}
            className={styles.updateButton}
          >
            Update User
          </button>
          <LogoutButton className={styles.logoutButton} />
        </nav>

        <main className={styles.mainContent}>
          {user ? (
            <ProfileCard user={user} />
          ) : (
            <p className={styles.noUserMessage}>User data is not available.</p>
          )}
        </main>

        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <UserUpdate
                user={user}
                onClose={handleModalClose}
                onUpdate={handleUpdateSuccess}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
