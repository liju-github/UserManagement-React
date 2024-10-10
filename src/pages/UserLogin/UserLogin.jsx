import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import styles from './UserLogin.module.css';

const UserLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.userAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        navigate("/user/home");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Fragment>
      <a href='/admin/login'>admin login</a>
      <a href='/signup'>signup</a>
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>User Login</h2>
      <form className={styles.form} onSubmit={handleLogin}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email:</label>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Password:</label>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <div className={styles.alert}>{error}</div>}
      </div>
    </Fragment>
  );
};

export default UserLogin;