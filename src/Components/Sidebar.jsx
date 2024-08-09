import React, { useState } from 'react';
import '../ComponentsCss/Sidebar.css';


const Sidebar = ({ scrollToCalendar, scrollToEvents, toggleAIAssistant, scrollToStatistics, scrollToCourses }) => {
    // Sidebar components Scrolling functions
    const handleScrollToStatistics = () => {
        scrollToStatistics();
    };

    return (
        <>
            <aside className="sidebar">
                <ul>
                    
                    {/* class name is the icon next to title in the side bar */}
                    <a className="sidebar-btn" onClick={scrollToCalendar}><li><i class="fa-solid fa-calendar"></i>Calendar</li></a>
                    <a className="sidebar-btn" onClick={scrollToEvents}><li><i class="fa-solid fa-calendar-plus"></i>Events</li></a>
                    <a className="sidebar-btn" onClick={scrollToCourses}><li><i class="fa-solid fa-calendar"></i>Courses</li></a>
                    <a className="sidebar-btn" onClick={handleScrollToStatistics}><li><i class="fa-solid fa-calendar-plus"></i>Statistics</li></a>
                    <a className="sidebar-btn" onClick={toggleAIAssistant}><li><i class="fa-solid fa-calendar-plus"></i>Assistant Chat</li></a>


                </ul>
            </aside>
        </>
    );
}

export default Sidebar;
