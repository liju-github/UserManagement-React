import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin } from '../../store/slices/slice';
import { useNavigate } from 'react-router-dom';
import styles from './AdminLogin.module.css';
import toast from 'react-hot-toast';

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
                toast.success("Admin Login Successful", {
                    position: "top-right",
                    style: {
                        marginTop: '50px',
                    },
                });
                navigate("/admin/dashboard");
            })
            .catch((err) => {
                let errorMessage = "Admin Login Failed, Invalid Credentials";
                if (err.response && err.response.status === 401) {
                    errorMessage = "Incorrect email or password";
                } else if (err.message === "Network Error") {
                    errorMessage = "Network error, please try again";
                } else if (err.response && err.response.status >= 500) {
                    errorMessage = "Server error, please contact support";
                }
                toast.error(errorMessage, {
                    position: "top-right",
                });
            });

    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.formContainer}>
                    <h2 className={styles.title}>Admin Login</h2>
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
                    <button
                        onClick={() => navigate("/login")}
                        className={styles.adminButton}
                    >
                        Proceed to User Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
