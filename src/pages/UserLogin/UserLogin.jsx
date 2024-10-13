import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import styles from './UserLogin.module.css';
import toast from 'react-hot-toast';

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
        toast.success("Login Successful", {
          position:"top-right"
        })
        navigate("/user/home");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.formContainer}>
          <h2 className={styles.title}>User Login</h2>
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={styles.button}
            >
              {loading ? 'Logging in...' : 'Continue'}
            </button>
          </form>
          {error && (
            <div className={styles.errorMessage}>{error}</div>
          )}
          <button
            onClick={() => navigate("/admin/login")}
            className={styles.adminButton}
          >
            Proceed to Admin Dashboard
          </button>
        </div>
      </div>
      <footer className={styles.footer}>
        <p>
          Don't have an account?{' '}
          <span
            onClick={() => navigate("/signup")}
            className={styles.signupLink}
          >
            Sign up
          </span>
        </p>
      </footer>
    </div>
  );
};

export default UserLogin;