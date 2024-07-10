import React, { useState } from 'react';
import './Sidebar.css';
import EventFormModal from './EventForm';

const Sidebar = ({ scrollToCalendar, scrollToEvents, toggleAIAssistant, scrollToStatistics }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Sidebar components Scrolling functions
    const handleScrollToStatistics = () => {
        scrollToStatistics(); 
    };
    
    // Sidebar add new events handler
    const handleAddNewEvent = () => {
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleSaveEvent = (event) => {
        
        console.log('sidebar - Event saved:', event);
        // Logic to save the event
    };


    return (
        <>
            <aside className="sidebar">
                <ul>
                    <li><a className="sidebar-btn" onClick={handleAddNewEvent}><i class="fa-solid fa-calendar-plus"></i> Add New Event</a></li>
                    <li><a className="sidebar-btn" onClick={scrollToCalendar}><i class="fa-solid fa-calendar"></i>Calendar</a></li>
                    <li><a className="sidebar-btn" onClick={scrollToEvents}><i class="fa-solid fa-calendar-plus"></i>Events</a></li>
                    <li><a className="sidebar-btn" onClick={handleScrollToStatistics}><i class="fa-solid fa-calendar-plus"></i>Statistics</a></li>
                    <li><a className="sidebar-btn" onClick={toggleAIAssistant}><i class="fa-solid fa-calendar-plus"></i>Assistant Chat</a></li>
                </ul>
            </aside>
            <EventFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveEvent} />
        </>
    );
}

export default Sidebar;
