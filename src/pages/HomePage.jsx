import React from 'react';
import './Home.css';
import CalendarComponent from '../Components/CalendarComponent';
import EventsComponent from '../Components/EventsComponent';

const HomePage = () => {
    return (
        <div className="homepage">
        <nav className="navbar">
            <h1>Study Buddy</h1>
            <div className="navbar-buttons">
                <button className="nav-btn">Home</button>
                <button className="nav-btn">About Us</button>
                <button className="nav-btn">Contact</button>
            </div>
        </nav>
        <div className="container">
            <aside className="sidebar">
                <ul>
                    <li><button className="sidebar-btn">Calendar</button></li>
                    <li><button className="sidebar-btn">Tasks</button></li>
                    <li><button className="sidebar-btn">Events</button></li>
                    <li><button className="sidebar-btn">Assistant Chat</button></li>
                </ul>
            </aside>
            <main className="main-content">
                <div className="calendar">
                    {/* Placeholder for calendar component */
                             
                    }
                    <h2>Calendar</h2>
                    <div className="calendar-container">
                        <CalendarComponent />
                    </div>
                    <div className="events-section">
                        <EventsComponent />
                    </div>
                </div>
            </main>
        </div>
    </div>
    );
}

export default HomePage;
