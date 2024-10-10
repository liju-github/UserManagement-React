import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin } from '../../store/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import styles from './AdminLogin.module.css';

const AdminLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.adminAuth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(loginAdmin({ email, password }))
            .unwrap()
            .then(() => {
                console.log("admin login successful redirecting")
                navigate("/admin/dashboard");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <a href='/login'>admin login</a>
            <a href='/signup'>signup</a>
            <div className={styles.loginContainer}>
                <h2 className={styles.title}>Admin Login</h2>
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
            </div></>
    );
};

export default AdminLogin;