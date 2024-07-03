import React, { useState } from 'react';
import './Sidebar.css';
import EventFormModal from './EventForm';

const Sidebar = ({ scrollToCalendar, scrollToEvents, toggleAIAssistant, scrollToStatistics }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Modal functions
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

    // Scroll to statistics function
    const handleScrollToStatistics = () => {
        scrollToStatistics(); // Assuming scrollToStatistics is implemented in the parent component
    };

    return (
        <>
            <aside className="sidebar">
                <ul>
                    <li><button className="sidebar-btn" onClick={handleAddNewEvent}>Add New Event</button></li>
                    <li><button className="sidebar-btn" onClick={scrollToCalendar}>Calendar</button></li>
                    <li><button className="sidebar-btn" onClick={scrollToEvents}>Events</button></li>
                    <li><button className="sidebar-btn" onClick={handleScrollToStatistics}>Statistics</button></li>
                    <li><button className="sidebar-btn" onClick={toggleAIAssistant}>Assistant Chat</button></li>
                </ul>
            </aside>
            <EventFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveEvent} />
        </>
    );
}

export default Sidebar;
