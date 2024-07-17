import React, { useState } from 'react';
import './Sidebar.css';


const Sidebar = ({ scrollToCalendar, scrollToEvents, toggleAIAssistant, scrollToStatistics }) => {
    // Sidebar components Scrolling functions
    const handleScrollToStatistics = () => {
        scrollToStatistics(); 
    };
    
    return (
        <>
            <aside className="sidebar">
                <ul>
                    <li><a className="sidebar-btn" onClick={scrollToCalendar}><i class="fa-solid fa-calendar"></i>Calendar</a></li>
                    <li><a className="sidebar-btn" onClick={scrollToEvents}><i class="fa-solid fa-calendar-plus"></i>Events</a></li>
                    <li><a className="sidebar-btn" onClick={handleScrollToStatistics}><i class="fa-solid fa-calendar-plus"></i>Statistics</a></li>
                    <li><a className="sidebar-btn" onClick={toggleAIAssistant}><i class="fa-solid fa-calendar-plus"></i>Assistant Chat</a></li>
                </ul>
            </aside>
        </>
    );
}

export default Sidebar;
