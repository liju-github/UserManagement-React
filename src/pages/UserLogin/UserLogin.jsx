import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/slices/slice';
import { useNavigate } from 'react-router-dom';
import styles from './UserLogin.module.css';
import toast from 'react-hot-toast';

const UserLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.userAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    setEmail('');
    setPassword('');
    setEmailError('');
    setPasswordError('');
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!validateEmail(e.target.value)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        toast.success("Login Successful", {
          position: "top-right",
          style: {
            marginTop: '50px',
          },
        });
        navigate("/user/home");
      })
      .catch((err) => {
        toast.error(err, {
          position: "top-right",
        });
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
                onChange={handleEmailChange}
                className={styles.input}
                required
              />
              {emailError && <span className={styles.errorText}>{emailError}</span>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className={styles.input}
                required
              />
              {passwordError && <span className={styles.errorText}>{passwordError}</span>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={styles.button}
            >
              {loading ? 'Logging in...' : 'Continue'}
            </button>
          </form>
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
