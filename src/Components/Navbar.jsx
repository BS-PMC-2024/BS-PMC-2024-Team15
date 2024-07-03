import React from 'react';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1>Study Buddy</h1>
            <div className="navbar-buttons">
                <button className="nav-btn">About Us</button>
                <button className="nav-btn">Contact</button>
                <button className="nav-btn">Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;
