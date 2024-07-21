// EventCard.js
import React from 'react';
import './EventPost.css'; // Ensure this import is correct

const EventCard = ({ event, onAddToCalendar }) => {
    const handleAddClick = () => {
        onAddToCalendar(event);
    };

    return (
        <div className="event-card">
            <h3>{event.title}</h3>
            <p>{event.startTime}</p>
            <p>{event.description}</p>
            <button onClick={handleAddClick}>Add to Calendar</button>
        </div>
    );
};

export default EventCard;
