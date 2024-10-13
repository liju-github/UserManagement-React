import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../../store/auth/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './UserSignup.module.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.userAuth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    address: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!emailRegex.test(formData.email.trim())) errors.email = 'Invalid email format';
    if (!formData.age) errors.age = 'Age is required';
    if (formData.age < 1) errors.age = 'Age must be a positive number';
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone Number is required';
    if (!formData.password.trim()) errors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    return errors;
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({});
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const signupData = {
      ...formData,
      age: Number(formData.age),
      phoneNumber: Number(formData.phoneNumber),
    };

    dispatch(signupUser(signupData))
      .unwrap()
      .then(() => {
        toast.success('Signup successful! Please log in.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((err) => {
        toast.error(err || 'Signup failed. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };

  return (
    <>
      <button onClick={() => window.location.href = '/admin/login'}>Admin Login</button>
      <button onClick={() => window.location.href = '/login'}>Login</button>

    <div className={styles.signupContainer}>
      <h2 className={styles.title}>Sign Up</h2>
      <form onSubmit={handleSignup} className={styles.form}>
        <input className={styles.input} type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        {validationErrors.name && <p className={styles.errorMessage}>{validationErrors.name}</p>}

        <input className={styles.input} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        {validationErrors.email && <p className={styles.errorMessage}>{validationErrors.email}</p>}

        <input className={styles.input} type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} min="1" required />
        {validationErrors.age && <p className={styles.errorMessage}>{validationErrors.age}</p>}

        <select className={styles.select} name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {validationErrors.gender && <p className={styles.errorMessage}>{validationErrors.gender}</p>}

        <input className={styles.input} type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        {validationErrors.address && <p className={styles.errorMessage}>{validationErrors.address}</p>}

        <input className={styles.input} type="number" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
        {validationErrors.phoneNumber && <p className={styles.errorMessage}>{validationErrors.phoneNumber}</p>}

        <input className={styles.input} type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        {validationErrors.password && <p className={styles.errorMessage}>{validationErrors.password}</p>}

        <input className={styles.input} type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
        {validationErrors.confirmPassword && <p className={styles.errorMessage}>{validationErrors.confirmPassword}</p>}

        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <ToastContainer />
    </div></>
  );
};

export default Signup;