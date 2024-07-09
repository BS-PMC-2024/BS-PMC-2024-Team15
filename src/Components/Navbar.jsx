import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    

    const handleLogout = () => {
        const accessToken = localStorage.getItem('accessToken');
        fetch("http://localhost:5000/logout", {
            method: 'POST',
            headers: {  //ERROR-LOGOUT RESPONCE --FIX *******
               
                // Add authorization header with bearer token if needed
                'Authorization': `Bearer ${accessToken}`
            },
        })
        .then(response => {
            if (response.ok) {
                //ERROR- NOT REMOVING TOKEN --FIX *******
                localStorage.removeItem('accessToken');
                navigate('/login');
            } else {
                throw new Error('Logout failed');
                navigate('/login');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle logout error
        });
    };


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
