import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadProfilePicture } from '../../store/auth/authSlice';
import styles from './ProfilePictureUpload.module.css';

const ProfilePictureUpload = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.userCrud);
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        try {
            const result = await dispatch(uploadProfilePicture(file)).unwrap();
            alert('Profile picture uploaded successfully!'); 
        } catch (error) {
            console.error('Image upload failed:', error);
        }
    };

    return (
        <div className={styles.uploadContainer}>
            <form onSubmit={handleUpload}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                />
                {file && (
                    <button type="submit" disabled={loading} className={styles.uploadButton}>
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                )}
            </form>
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
};

export default ProfilePictureUpload;
