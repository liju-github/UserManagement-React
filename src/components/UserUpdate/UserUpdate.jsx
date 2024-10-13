import React, { useState } from 'react';
import axios from 'axios';
import styles from './UserUpdate.module.css';
import { API_USER_URL } from '../../constants';
import toast from 'react-hot-toast';

const UserUpdate = ({ user, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        id: user.id,
        name: user.name || '',
        age: user.age || 0,
        gender: user.gender || '',
        address: user.address || '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);


    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) errors.name = 'Name is required';
        if (formData.age === undefined || formData.age === null) {
            errors.age = 'Age is required';
        } else if (formData.age < 1) {
            errors.age = 'Age must be a positive number';
        }
        if (!formData.gender) errors.gender = 'Gender is required';
        if (!formData.address.trim()) errors.address = 'Address is required';

        return errors;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_USER_URL}/update`, formData, {
                headers: { Authorization: `Bearer ${token}`, Operation: 'UPDATE' },
            });

            if (response.status === 200) {
                toast.success("Profile Updated Successfully", {
                    position: "top-center"
                });
                onUpdate();
            } else {
                toast.error("Failed to update profile.", {
                    position: "top-center"
                });
            }
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('An error occurred while updating the profile.', {
                position: "top-center"
            });
        } finally {
            setLoading(false);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'age') {
            setFormData({ ...formData, [name]: Number(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2>Update User</h2>
                <form onSubmit={handleSubmit}>
                    { }
                    <div className={styles.formGroup}>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <p className={styles.error}>{errors.name}</p>}
                    </div>

                    { }
                    <div className={styles.formGroup}>
                        <label>Age:</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                        />
                        {errors.age && <p className={styles.error}>{errors.age}</p>}
                    </div>

                    { }
                    <div className={styles.formGroup}>
                        <label>Gender:</label>
                        <select name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        {errors.gender && <p className={styles.error}>{errors.gender}</p>}
                    </div>

                    { }
                    <div className={styles.formGroup}>
                        <label>Address:</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                        {errors.address && <p className={styles.error}>{errors.address}</p>}
                    </div>

                    { }
                    <div className={styles.buttonGroup}>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserUpdate;
