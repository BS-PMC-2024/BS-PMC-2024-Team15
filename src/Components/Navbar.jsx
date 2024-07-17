import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';  // Import the logout action
import './Navbar.css';
import MyProfileForm from './MyProfileForm';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // Add useState for profile modal

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        dispatch(logout());  // Dispatch the logout action to update Redux state
        navigate('/login');
    };

    const handleOpenProfile = () => {
        setIsProfileModalOpen(true); // Open profile modal
    };

    const handleCloseProfile = () => {
        setIsProfileModalOpen(false); // Close profile modal
    };

    const handleSaveProfile = () => {
        // Logic to save the profile data
    };

    return (
        <nav className="navbar">
            <h1>Study Buddy</h1>
            <div className="navbar-buttons">
                <button className="nav-btn">About Us</button>
                <button className="nav-btn" onClick={handleOpenProfile}>My Profile</button>
                <button className="nav-btn" onClick={handleLogout}>Logout</button>
            </div>
            <MyProfileForm
                isOpen={isProfileModalOpen}
                onClose={handleCloseProfile}
                onSave={handleSaveProfile}
            />
        </nav>
    );
}

export default Navbar;
