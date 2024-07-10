import React, { useState, useEffect } from 'react';
import './Events.css';
import EventFormModal from './EventForm'; // Import the modal component

const EventsComponent = () => {
    const [events, setEvents] = useState([]);
    const [showEventForm, setShowEventForm] = useState(false); // State to manage modal visibility
    const [selectedEvent, setSelectedEvent] = useState(null); // State to store selected event for editing

    // Function to fetch events from Flask endpoint
    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:5000/get_events');
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };
    
    useEffect(() => {
        fetchEvents();
    }, []);
    
    // Function to toggle modal visibility and set selected event for editing
    const toggleEventForm = (event) => {
        setSelectedEvent(event); // Set selected event for editing
        setShowEventForm(!showEventForm); // Toggle modal visibility
    };

    // Calculating time left until upcoming event starts
    const calculateTimeLeft = (startTime) => {
        const eventTime = new Date(startTime);
        const now = new Date();
        const timeLeft = eventTime - now;
        if (timeLeft < 0) return 'Event has started';
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
        return `${days}d ${hours}h ${minutes}m`;
    };

    // Handle adding a new event
    const handleAddNewEvent = () => {
        toggleEventForm(null); // Open the modal for adding new event
    };

    // Handle updating an existing event
    const handleUpdateEvent = async (updatedEvent) => {
        try {
            const response = await fetch(`http://localhost:5000/update_event/${updatedEvent.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEvent),
            });
            if (!response.ok) {
                throw new Error('Failed to update event');
            }
            // Refresh events after updating
            fetchEvents();
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    // Handle removing an event
    const handleRemoveEvent = async (eventId) => {
        try {
            const response = await fetch(`http://localhost:5000/remove_event/${eventId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to remove event');
            }
            // Refresh events after removing
            fetchEvents();
        } catch (error) {
            console.error('Error removing event:', error);
        }
    };
    
    // Function to determine row class based on event importance
    function getRowClassName(importance) {
        switch (importance) {
            case 'High':
                return 'high-importance';
            case 'Medium':
                return 'medium-importance';
            case 'Low':
                return 'low-importance';
            default:
                return '';
        }
    }

    return (
        <div className="events">
            {events.length === 0 ? (
                <h2>No Upcoming Events</h2>
            ) : (
                <>
                    <h2>My Upcoming Events</h2>
                    <table className="events-table">
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Starting Time</th>
                                <th>Time Left</th>
                                <th>Duration</th>
                                <th>Importance Level</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id} className={getRowClassName(event.importance)}>
                                    <td>{event.title}</td>
                                    <td>{new Date(event.startTime).toLocaleString()}</td>
                                    <td>{calculateTimeLeft(event.startTime)}</td>
                                    <td>{event.duration}</td>
                                    <td>{event.importance}</td>
                                    <td>
                                        <button className="edit-btn" onClick={() => toggleEventForm(event)}>Edit</button>
                                        <button className="remove-btn" onClick={() => handleRemoveEvent(event.id)}>Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
            <EventFormModal 
                isOpen={showEventForm} 
                onClose={() => {
                    toggleEventForm(null); // Close modal
                    setSelectedEvent(null); // Clear selected event after closing
                }} 
                onSave={() => {
                    fetchEvents(); // Refresh events after saving or updating
                    setSelectedEvent(null); // Clear selected event after saving or updating
                }} 
                event={selectedEvent} 
                onUpdate={handleUpdateEvent} // Pass update handler to modal
            />
        </div>
    );
}

export default EventsComponent;
