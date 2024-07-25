import React from 'react';
import '../ComponentsCss/PostCarousel.css'; // Ensure this import is correct

const PostCard = ({ event, onAddToCalendar, onEdit, onRemove }) => {
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
            {event.imageUrl && <img src={event.imageUrl} alt="Event" style={{ width: '400px', height: '200px' }} />}
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

export default PostCard;
