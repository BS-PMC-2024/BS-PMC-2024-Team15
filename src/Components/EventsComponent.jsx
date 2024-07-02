// EventsComponent.js
import React from 'react';
import './EventsComponent.css';

const events = [
    //test events for ui
    { id: 1, title: 'React Study Group', startTime: '2024-07-10T10:00', duration: '2 hours', importance: 'High' },
    { id: 2, title: 'JavaScript Workshop', startTime: '2024-07-15T14:00', duration: '3 hours', importance: 'Medium' },
    { id: 3, title: 'CSS Deep Dive', startTime: '2024-08-20T09:00', duration: '1.5 hours', importance: 'Low' },
];

const EventsComponent = () => {

    //calculating time left untill upcoming event starts
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

    return (
        <div className="events">
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
                    {events.map(event => (
                        <tr key={event.id}>
                            <td>{event.title}</td>
                            <td>{new Date(event.startTime).toLocaleString()}</td>
                            <td>{calculateTimeLeft(event.startTime)}</td>
                            <td>{event.duration}</td>
                            <td>{event.importance}</td>
                            <td>
                                <button>|Edit-btn|</button>
                        
                                <button>|Remove-btn|</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default EventsComponent;
