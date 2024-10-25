import React, { useState } from 'react';
import styles from './UserCreateForm.module.css';

const UserForm = ({ onSubmit, initialData = {}, isAdmin = false }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: '',
        gender: '',
        address: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        ...initialData
    });
    const [validationErrors, setValidationErrors] = useState({});

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
        if (!isAdmin) {
            if (!formData.password.trim()) errors.password = 'Password is required';
            if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
        }

        return errors;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setValidationErrors({});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const userData = {
            ...formData,
            age: Number(formData.age),
            phoneNumber: Number(formData.phoneNumber),
        };

        onSubmit(userData);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
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

            {(
                <>
                    <input className={styles.input} type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                    {validationErrors.password && <p className={styles.errorMessage}>{validationErrors.password}</p>}

                    <input className={styles.input} type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                    {validationErrors.confirmPassword && <p className={styles.errorMessage}>{validationErrors.confirmPassword}</p>}
                </>
            )}

            <button className={styles.button} type="submit">
                {isAdmin ? 'Create User' : 'Sign Up'}
            </button>
        </form>
    );
};

export default UserForm;