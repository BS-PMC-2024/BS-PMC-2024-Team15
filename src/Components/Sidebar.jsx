import React, { useState } from 'react';
import './Sidebar.css';
import EventFormModal from './EventForm';

const Sidebar = ({ scrollToCalendar, scrollToEvents }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);



    //adding new event Model functions
    const handleAddNewEvent = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveEvent = (event) => {

        console.log('sidebar -Event saved:', event);
        // Here you can add the logic to save the event
    };




    return (
        <>
            <aside className="sidebar">
                <ul>
                    <li><button className="sidebar-btn" onClick={handleAddNewEvent}>Add New Event</button></li>
                    <li><button className="sidebar-btn" onClick={scrollToCalendar}>Calendar</button></li>
                    <li><button className="sidebar-btn">Tasks</button></li>
                    <li><button className="sidebar-btn" onClick={scrollToEvents}>Events</button></li>
                    <li><button className="sidebar-btn">Assistant Chat</button></li>
                </ul>
            </aside>
            <EventFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveEvent} />
        </>
    );
}

export default Sidebar;
