import React, { useState, useEffect } from 'react';
import './Events.css';
import EventFormModal from './EventForm'; // Import the modal component

const EventsComponent = ({ events, loading, fetchEvents }) => {
    const [showEventForm, setShowEventForm] = useState(false); // State to manage modal visibility
    const [selectedEvent, setSelectedEvent] = useState(null); // State to store selected event for editing

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

    // Separate events into upcoming and completed
    const now = new Date();
    const upcomingEvents = events.filter(event => new Date(event.startTime) > now);
    const completedEvents = events.filter(event => new Date(event.startTime) <= now);

    // Handle updating an existing event
    const handleSaveEvent = async (event) => {
        try {
            const method = event.id ? 'PUT' : 'POST';
            const endpoint = event.id ? `update_event/${event.id}` : 'add_event';
            

            const response = await fetch(`http://localhost:5000/${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            });

            if (!response.ok) {
                throw new Error(`Failed to ${event.id ? 'update' : 'add'} event`);
            }

            // Refresh events after saving or updating
            fetchEvents();
            setShowEventForm(false); // Close the modal after saving
        } catch (error) {
            console.error(`Error ${event.id ? 'updating' : 'adding'} event:`, error);
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
    const getRowClassName = (importance) => {
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
    };

    return (
        <div className="events">
            {loading ? (
                <p>Loading events...</p>
            ) : (
                <>
                    {upcomingEvents.length === 0 && completedEvents.length === 0 ? (
                        <h2>No Events</h2>
                    ) : (
                        <>
                            {upcomingEvents.length > 0 && (
                                <>
                                    <h2>My Upcoming Events</h2>
                                    <table className="events-table">
                                        <thead>
                                            <tr>
                                                <th>Event Name</th>
                                                <th>Starting Time</th>
                                                <th>Time Left</th>
                                                <th>Duration</th>
                                                <th>Type/Importance</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {upcomingEvents.map((event) => (
                                                <tr key={event.id} className={getRowClassName(event.importance)}>
                                                    <td>{event.title}</td>
                                                    <td>{new Date(event.startTime).toLocaleString()}</td>
                                                    <td>{calculateTimeLeft(event.startTime)}</td>
                                                    <td>{event.duration}</td>
                                                    <td>{event.eventType}/{event.importance}</td>
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
                            
                            {completedEvents.length > 0 && (
                                <>
                                    <h2>Completed Events</h2>
                                    <table className="events-table completed-events-table">
                                        <thead>
                                            <tr>
                                                <th>Event Name</th>
                                                <th>Starting Time</th>
                                                <th>Duration</th>
                                                <th>Type/Importance</th>
                                                <th>summary</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {completedEvents.map((event) => (
                                                <tr key={event.id} className={getRowClassName(event.importance)}>
                                                    <td>{event.title}</td>
                                                    <td>{new Date(event.startTime).toLocaleString()}</td>
                                                    <td>{event.duration}</td>
                                                    <td>{event.eventType}/{event.importance}</td>
                                                    <td>
                                                        <button className="edit-btn" onClick={() => toggleEventForm(event)}>Rank efficency</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </>
                    )}
                    <EventFormModal 
                        isOpen={showEventForm} 
                        onClose={() => setShowEventForm(false)} 
                        onSave={handleSaveEvent} 
                        event={selectedEvent} 
                        slot={null} 
                    />
                </>
            )}
        </div>
    );
};

export default EventsComponent;
