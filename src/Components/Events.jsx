import React, { useState, useEffect } from 'react';
import '../ComponentsCss/Events.css';
import EventFormModal from './EventForm'; // Import the modal component

const EventsComponent = ({ events, loading, fetchEvents }) => {
    const [showEventForm, setShowEventForm] = useState(false); // State to manage modal visibility
    const [selectedEvent, setSelectedEvent] = useState(null); // State to store selected event for editing
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false); // State for remove confirmation modal
    const [eventToRemove, setEventToRemove] = useState(null); // State to store event ID to remove

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
        return { days, hours, minutes, total: timeLeft }; // Return total milliseconds for sorting
    };

    // Separate events into upcoming and completed
    const now = new Date();
    const upcomingEvents = events.filter(event => new Date(event.startTime) > now);
    const completedEvents = events.filter(event => new Date(event.startTime) <= now);

    // Function to sort events by time left
    const sortEventsByTimeLeft = (events) => {
        return events.slice().sort((a, b) => {
            const timeLeftA = calculateTimeLeft(a.startTime).total;
            const timeLeftB = calculateTimeLeft(b.startTime).total;
            return timeLeftA - timeLeftB; // Sort in ascending order of time left
        });
    };

    // Get sorted upcoming events
    const sortedUpcomingEvents = sortEventsByTimeLeft(upcomingEvents);//sorted events by time

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
            alert('event added successfully!');
            fetchEvents();
            setShowEventForm(false); // Close the modal after saving
        } catch (error) {
            console.error(`Error ${event.id ? 'updating' : 'adding'} event:`, error);
        }
    };

    // Handle removing an event with confirmation
    const confirmRemoveEvent = (eventId) => {
        setEventToRemove(eventId); // Set the event ID to be removed
        setIsRemoveModalOpen(true); // Open the confirmation modal
    };

    const handleRemoveEvent = async () => {
        try {
            const response = await fetch(`http://localhost:5000/remove_event/${eventToRemove}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to remove event');
            }
            // Refresh events after removing
            alert('event removed');
            fetchEvents();
            setIsRemoveModalOpen(false); // Close the confirmation modal
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
                            {sortedUpcomingEvents.length > 0 && (
                                <>
                                    <h3>My Upcoming Events</h3>
                                    <div className="events-table-container">
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
                                                {sortedUpcomingEvents.map((event) => (
                                                    <tr key={event.id} className={getRowClassName(event.importance)}>
                                                        <td>{event.title}</td>
                                                        <td>{new Date(event.startTime).toLocaleString()}</td>
                                                        <td>{calculateTimeLeft(event.startTime).days}d {calculateTimeLeft(event.startTime).hours}h {calculateTimeLeft(event.startTime).minutes}m</td>
                                                        <td>{event.duration}</td>
                                                        <td>{event.eventType}/{event.importance}</td>
                                                        <td>
                                                            <button className="edit-btn" onClick={() => toggleEventForm(event)}><i className="fa-solid fa-pencil"></i> Edit</button>
                                                            <button className="remove-btn" onClick={() => confirmRemoveEvent(event.id)}><i className="fa-solid fa-trash"></i> Remove</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}

                            {completedEvents.length > 0 && (
                                <>
                                    <h3>Completed Events</h3>
                                    <div className="events-table-container">
                                        <table className="events-table completed-events-table">
                                            <thead>
                                                <tr>
                                                    <th>Event Name</th>
                                                    <th>Starting Time</th>
                                                    <th>Duration</th>
                                                    <th>Type/Importance</th>
                                                    <th>Summary</th>
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
                                                            <button className="edit-btn" onClick={() => toggleEventForm(event)}><i className="fa-solid fa-ranking-star"></i> Rank </button>
                                                            <button className="remove-btn" onClick={() => confirmRemoveEvent(event.id)}><i className="fa-solid fa-trash"></i> Remove</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
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

                    {/* Remove Confirmation Modal */}
                    {isRemoveModalOpen && (
                        <div className="modal-background">
                            <div className="modal-content">
                                <h2>Confirm Remove Event</h2>
                                <p>Are you sure you want to remove this event?</p>
                                <div className="modal-buttons">
                                    <button className="modal-btn" onClick={handleRemoveEvent}>Yes</button>
                                    <button className="modal-btn" onClick={() => setIsRemoveModalOpen(false)}>No</button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default EventsComponent;
