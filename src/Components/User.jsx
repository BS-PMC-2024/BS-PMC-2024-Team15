import React, { useState, useEffect } from 'react';
import '../ComponentsCss/Users.css';

const UsersComponent = ({ loading }) => {
    const [users, setUsers] = useState([]);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [userToRemove, setUserToRemove] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/get_users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const confirmRemoveUser = (userId) => {
        setUserToRemove(userId);
        setIsRemoveModalOpen(true);
    };

    const handleRemoveUser = async () => {
        try {
            const response = await fetch(`http://localhost:5000/remove_user/${userToRemove}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to remove user');
            }
            alert('User removed');
            setUsers(users.filter(user => user.id !== userToRemove));
            setIsRemoveModalOpen(false);
        } catch (error) {
            console.error('Error removing user:', error);
        }
    };

    const getRowClassName = (role) => {
        switch (role) {
            case 'Admin':
                return 'admin-role';
            case 'User':
                return 'user-role';
            default:
                return '';
        }
    };

    return (
        <div className="users">
            {loading ? (
                <p>Loading users...</p>
            ) : (
                <>
                    {users.length === 0 ? (
                        <h2>No Users</h2>
                    ) : (
                        <div className="users-table-container">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className={getRowClassName(user.role)}>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                            <td>
                                                <button className="remove-btn" onClick={() => confirmRemoveUser(user.id)}><i className="fa-solid fa-trash"></i> Remove</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {isRemoveModalOpen && (
                        <div className="modal-background">
                            <div className="modal-content">
                                <h2>Confirm Remove User</h2>
                                <p>Are you sure you want to remove this user?</p>
                                <div className="modal-buttons">
                                    <button className="modal-btn" onClick={handleRemoveUser}>Yes</button>
                                    <button className="modal-btn" onClick={() => setIsRemoveModalOpen(false)}>No</button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default UsersComponent;