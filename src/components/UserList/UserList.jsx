import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfileList, deleteUser, blockUser, unblockUser, signupUser } from '../../store/auth/authSlice';
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
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const [itemsPerPage] = useState(10); // Number of items per page

    console.log(users);

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

    const handleEdit = (user) => {
        setEditingUser(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            await dispatch(deleteUser(id));
            fetchUsers();
        }
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

    // Filtered users based on the search term
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate the slice of users for the current page
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Pagination logic: Calculate total pages
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    // Handle page change
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
                        <th>Name</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.age}</td>
                            <td>{user.gender}</td>
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
                                    onClick={() => handleDelete(user.id)}
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

            {/* Pagination controls */}
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

        </div>
    );
};

export default UserList;
