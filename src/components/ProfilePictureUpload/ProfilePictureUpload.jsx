import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadProfilePicture } from '../../store/auth/authSlice';
import styles from './ProfilePictureUpload.module.css';
import toast from 'react-hot-toast';


const ProfilePictureUpload = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.userCrud);
    const [file, setFile] = useState(null);

    const fileInputRef = useRef(null);

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

            
            if (result.success) {
                toast.success('Profile picture uploaded successfully!', {
                    position: "top-center"
                });
                {
                    // setFile(null);
                    // fileInputRef.current.value = ''; 
                }
            }
        } catch (err) {
            
            toast.error(`Profile picture upload failed`, {
                position: "top-center"
            });
        }
    };




    return (
        <div className={styles.uploadContainer}>
            <form onSubmit={handleUpload}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef} 
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
