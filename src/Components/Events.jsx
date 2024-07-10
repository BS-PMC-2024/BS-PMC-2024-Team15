import React, { useState, useEffect } from 'react';
import './Events.css';
import EventFormModal from './EventForm'; // Import the modal component

const EventsComponent = () => {
    const [events, setEvents] = useState([]);
    const [showEventForm, setShowEventForm] = useState(false); // State to manage modal visibility

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
    
    // Function to toggle modal visibility
    const toggleEventForm = () => {
        setShowEventForm(!showEventForm);
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
        toggleEventForm(); // Open the modal
    };

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
    
    return (
        <div className="events">
            {events.length === 0 ? (
                <h2>No Upcoming Events 
                    <button className="sidebar-btn" onClick={handleAddNewEvent}>Add New Event</button>
                </h2>
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
                                <tr key={event.id}>
                                    <td>{event.title}</td>
                                    <td>{new Date(event.startTime).toLocaleString()}</td>
                                    <td>{calculateTimeLeft(event.startTime)}</td>
                                    <td>{event.duration}</td>
                                    <td>{event.importance}</td>
                                    <td>
                                        <button>| Edit-btn |</button>
                                        <button onClick={() => handleRemoveEvent(event.id)}>Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
            <EventFormModal isOpen={showEventForm} onClose={toggleEventForm}  />
        </div>
    );
}

export default EventsComponent;
