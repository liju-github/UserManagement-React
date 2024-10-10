import React from 'react';
import LogoutButton from '../LogoutButton/LogoutButton';
import styles from './Navbar.module.css'; // Import CSS module correctly

const Navbar = () => {
  return (
    <div className={styles.container}> {/* Use className instead of style */}
      <LogoutButton />
    </div>
  );
}

export default Navbar;
