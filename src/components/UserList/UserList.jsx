import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfileList, deleteUser, blockUser, unblockUser, signupUser } from '../../store/slices/slice';
import { getRandomAvatarURL } from "../../constants";
import UserUpdate from '../../components/UserUpdate/UserUpdate';
import UserForm from '../../components/UserCreateForm/UserCreateForm';
import styles from './UserList.module.css';
import toast from 'react-hot-toast';

const UserList = () => {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.adminCrud.users);
    const [editingUser, setEditingUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        fetchUsers();
    }, [dispatch]);

    const fetchUsers = async () => {
        try {
            await dispatch(fetchUserProfileList()).unwrap();
            console.log('User profiles fetched successfully.');
        } catch (err) {
            console.error('Failed to fetch user profiles:', err);
        }
    };

    // Retrieve image from localStorage or generate a new one
    const getAvatarUrl = (user) => {
        const storedAvatar = localStorage.getItem(`avatar-${user.id}`);
        if (storedAvatar) {
            return storedAvatar;
        }

        const avatarUrl = user.image_url ? user.image_url : getRandomAvatarURL();
        localStorage.setItem(`avatar-${user.id}`, avatarUrl);
        return avatarUrl;
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (userToDelete) {
            await dispatch(deleteUser(userToDelete.id));
            setShowDeleteModal(false);
            setUserToDelete(null);
            fetchUsers();
            toast.success('User deleted successfully!', {
                position: "top-right"
            });
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
    };

    const handleBlockToggle = async (user) => {
        if (user.is_blocked) {
            await dispatch(unblockUser(user.id));
        } else {
            await dispatch(blockUser(user.id));
        }
        fetchUsers();
    };

    const handleCreateUser = async (userData) => {
        try {
            await dispatch(signupUser(userData)).unwrap();
            setShowCreateModal(false);
            toast.success('User created successfully!', {
                position: "top-right"
            });
            fetchUsers();
        } catch (error) {
            toast.error('Failed to create user: ' + error.message, {
                position: "top-right"
            });
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>User List</h2>
            <div className={styles.actions}>
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                <button className={styles.createButton} onClick={() => setShowCreateModal(true)}>Create User</button>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Address</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user) => (
                        <tr key={user.id}>
                            <td><img src={getAvatarUrl(user)} alt="profile image" /></td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.age}</td>
                            <td>{user.gender}</td>
                            <td>{user.address}</td>
                            <td>{user.is_blocked ? 'Blocked' : 'Active'}</td>
                            <td>
                                <button
                                    className={styles.editButton}
                                    onClick={() => handleEdit(user)}
                                >
                                    Edit
                                </button>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDeleteClick(user)}
                                >
                                    Delete
                                </button>
                                <button
                                    className={user.is_blocked ? styles.unblockButton : styles.blockButton}
                                    onClick={() => handleBlockToggle(user)}
                                >
                                    {user.is_blocked ? 'Unblock' : 'Block'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={styles.pagination}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={styles.pageButton}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`${styles.pageButton} ${currentPage === index + 1 ? styles.activePage : ''}`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={styles.pageButton}
                >
                    Next
                </button>
            </div>

            {showModal && editingUser && (
                <UserUpdate
                    user={editingUser}
                    onClose={handleCloseModal}
                    onUpdate={() => {
                        fetchUsers();
                    }}
                />
            )}
            {showCreateModal && (
                <>
                    <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)} />
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h2>Create New User</h2>
                            <UserForm
                                onSubmit={handleCreateUser}
                                isAdmin={true}
                                className={styles.modalForm}
                            />
                            <button
                                className={styles.closeButton}
                                onClick={() => setShowCreateModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </>
            )}
            {showDeleteModal && (
                <>
                    <div className={styles.modalOverlay} onClick={handleDeleteCancel} />
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h2>Confirm Delete</h2>
                            <p>Are you sure you want to delete the user: {userToDelete?.name}?</p>
                            <p>This action cannot be undone.</p>
                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={handleDeleteCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.confirmDeleteButton}
                                    onClick={handleDeleteConfirm}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserList;
