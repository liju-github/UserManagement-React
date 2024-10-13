import React from 'react';
import LogoutButton from '../LogoutButton/LogoutButton';
import styles from './Navbar.module.css'; 

const Navbar = () => {
  return (
    <div className={styles.container}> 
      <LogoutButton />
    </div>
  );
}

export default Navbar;
