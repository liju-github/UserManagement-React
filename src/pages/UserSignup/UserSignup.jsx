import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../../store/slices/slice';
import toast from 'react-hot-toast';
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
  

  const validateField = (name, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    switch (name) {
      case 'name':
        return value.trim() ? '' : 'Name is required';
      case 'email':
        return !value.trim() ? 'Email is required' :
          !emailRegex.test(value.trim()) ? 'Invalid email format' : '';
      case 'age':
        return !value ? 'Age is required' :
          value < 1 ? 'Age must be a positive number' : '';
      case 'gender':
        return value ? '' : 'Gender is required';
      case 'address':
        return value.trim() ? '' : 'Address is required';
      case 'phoneNumber':
        return value.trim() ? '' : 'Phone Number is required';
      case 'password':
        return value.trim() ? '' : 'Password is required';
      case 'confirmPassword':
        return value === formData.password ? '' : 'Passwords do not match';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const error = validateField(name, value);
    setValidationErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const errors = Object.keys(formData).reduce((acc, key) => {
      const error = validateField(key, formData[key]);
      if (error) acc[key] = error;
      return acc;
    }, {});

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
        navigate('/login');
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
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.formContainer}>
          <h2 className={styles.title}>Sign Up</h2>
          <form onSubmit={handleSignup} className={styles.form}>
            <div className={styles.formGroup}>
              <input className={styles.input} type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
              {validationErrors.name && <p className={styles.errorText}>{validationErrors.name}</p>}
            </div>

            <div className={styles.formGroup}>
              <input className={styles.input} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              {validationErrors.email && <p className={styles.errorText}>{validationErrors.email}</p>}
            </div>

            <div className={styles.formGroup}>
              <input className={styles.input} type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} min="1" required />
              {validationErrors.age && <p className={styles.errorText}>{validationErrors.age}</p>}
            </div>

            <div className={styles.formGroup}>
              <select className={styles.input} name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {validationErrors.gender && <p className={styles.errorText}>{validationErrors.gender}</p>}
            </div>

            <div className={styles.formGroup}>
              <input className={styles.input} type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
              {validationErrors.address && <p className={styles.errorText}>{validationErrors.address}</p>}
            </div>

            <div className={styles.formGroup}>
              <input className={styles.input} type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
              {validationErrors.phoneNumber && <p className={styles.errorText}>{validationErrors.phoneNumber}</p>}
            </div>

            <div className={styles.formGroup}>
              <input className={styles.input} type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              {validationErrors.password && <p className={styles.errorText}>{validationErrors.password}</p>}
            </div>

            <div className={styles.formGroup}>
              <input className={styles.input} type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
              {validationErrors.confirmPassword && <p className={styles.errorText}>{validationErrors.confirmPassword}</p>}
            </div>

            <button className={styles.button} type="submit" disabled={loading || Object.values(validationErrors).some(error => error !== '')}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
          <div className={styles.footer}>
            <p>
              Already have an account?{' '}
              <span className={styles.loginLink} onClick={() => navigate('/login')}>
                Log in
              </span>
            </p>
          </div>
          <button className={styles.adminButton} onClick={() => navigate('/admin/login')}>
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;