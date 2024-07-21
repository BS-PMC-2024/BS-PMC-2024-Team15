import React from 'react';
import './EventPost.css'; // Ensure this import is correct

const EventCard = ({ event, onAddToCalendar, onEdit, onRemove }) => {
    const handleAddClick = () => {
        onAddToCalendar(event);
    };

    const handleEditClick = () => {
        onEdit(event);
    };

    const handleRemoveClick = () => {
        onRemove(event.id);
    };

    return (
        <div className="event-card">
            <h3>{event.title}</h3>
            <p>{event.startTime}</p>
            <p>{event.description}</p>
            <div className="button-container">
                <button onClick={handleAddClick}>Add to Calendar</button>
                <button className="edit" onClick={handleEditClick}>Edit Post -admin</button>
                <button className="remove" onClick={handleRemoveClick}>Remove Post -admin</button>
            </div>
        </div>
    );
};

export default EventCard;
