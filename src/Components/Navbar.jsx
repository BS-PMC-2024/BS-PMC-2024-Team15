import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Add your logout logic here (e.g., clearing user data, tokens, etc.)
        navigate('/login');
    }

    return (
        <nav className="navbar">
            <h1>Study Buddy</h1>
            <div className="navbar-buttons">
                <button className="nav-btn">About Us</button>
                <button className="nav-btn">Contact</button>
                <button className="nav-btn" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;
