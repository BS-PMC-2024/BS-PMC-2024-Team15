import React, { useState, useEffect } from 'react';
import './MyProfileForm.css';
import { getToken } from '../features/tokenUtils';

const MyProfileForm = ({ isOpen, onClose, onSave }) => {
    const [profileData, setProfileData] = useState({
        email: '',
        dateOfBirth: '',
        type: 'student',
        receiveNews: false,
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchUserData();
        }
    }, [isOpen]);

    const fetchUserData = async () => {
        const token = getToken();
        try {
            const response = await fetch('http://localhost:5000/get_user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setProfileData(data);
            } else {
                setMessage('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setMessage('Failed to fetch user data');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfileData({
            ...profileData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleBack = () => {
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = getToken();

        const response = await fetch('http://localhost:5000/update_user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(profileData),
        });

        if (response.ok) {
            setMessage('Profile updated successfully');
            onSave();
            onClose();
        } else {
            setMessage('Failed to update profile');
        }
    };

    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <form onSubmit={handleSubmit}>
                    <h2>My Profile</h2>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Date of Birth:
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={profileData.dateOfBirth}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Type:
                        <select
                            name="type"
                            value={profileData.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="student">Student</option>
                            <option value="lecturer">Lecturer</option>
                        </select>
                    </label>
                    <label>
                        Receive News:
                        <input
                            type="checkbox"
                            name="receiveNews"
                            checked={profileData.receiveNews}
                            onChange={handleChange}
                        />
                    </label>
                    <div className="modal-buttons"> 
                    <button type="submit">Save</button>
                    <button type="button" onClick={handleBack}>Back</button>
                    </div>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default MyProfileForm;
