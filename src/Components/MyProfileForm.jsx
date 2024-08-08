import React, { useState, useEffect } from 'react';
import '../ComponentsCss/MyProfileForm.css';
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
                    
                    <h2>Profile:{"" +profileData.fullName}</h2>
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
                        Receive News:
                        <input
                            type="checkbox"
                            name="receiveNews"
                            checked={profileData.receiveNews}
                            onChange={handleChange}
                        />
                    </label>
                    <h3>User created at: {"" +profileData.createdAt}</h3>
                    
                    <h2>my first quizz : </h2>
                    
                    <h3>How often do you plan your day in advance?: { profileData.planDay} </h3>
                    <h3>How well do you stick to your planned schedule?: { profileData.stickSchedule}</h3>
                    <h3>How effectively do you prioritize your tasks?: { profileData.prioritizeTasks}</h3>
                    <h3>How often do you meet deadlines?: { profileData.deadlinedTasks}</h3>
                    <h3>How satisfied are you with your current time management skills?: { profileData.satesfiedTasks}</h3>
                    
                    <div className="modal-buttons"> 
                    <button type="submit">Edit information</button>
                    <button type="button" onClick={handleBack}>Back</button>
                    </div>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default MyProfileForm;
