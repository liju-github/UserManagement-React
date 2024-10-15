import React from 'react';
import styles from './ProfileCard.module.css';
import ProfilePictureUpload from '../ProfilePictureUpload/ProfilePictureUpload';
import defaultImage from "../../assets/images/mario-working.gif"

const ProfileCard = ({ user }) => {
    return (
        <div className={styles.profileCard}>
            <div className={styles.image}>
                <div className={styles.imagePreview}>
                    <img
                        src={user.image_url || defaultImage}
                        alt={user.name}
                        className={styles.profilePicture}
                    />
                    <ProfilePictureUpload />
                </div>
            </div>
            <table className={styles.profileDetails}>
                <tbody>
                    <tr>
                        <td><strong>Name:</strong></td>
                        <td>{user.name}</td>
                    </tr>
                    <tr>
                        <td><strong>Email:</strong></td>
                        <td>{user.email}</td>
                    </tr>
                    <tr>
                        <td><strong>Age:</strong></td>
                        <td>{user.age || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td><strong>Gender:</strong></td>
                        <td>{user.gender || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td><strong>Address:</strong></td>
                        <td>{user.address}</td>
                    </tr>
                    <tr>
                        <td><strong>Verified:</strong></td>
                        <td>{user.is_verified ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr>
                        <td><strong>Blocked:</strong></td>
                        <td>{user.is_blocked ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr>
                        <td><strong>Joined:</strong></td>
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ProfileCard;
