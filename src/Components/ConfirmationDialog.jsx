// ConfirmationDialog.js
import React from 'react';
import './ConfirmationDialog.css'; // Create this CSS file for styles

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, eventDetails }) => {
    if (!isOpen) return null;

    return (
        <div className="confirmation-dialog">
            <div className="confirmation-dialog-content">
                <h3>Do you want to add this event?</h3>
                <div className="event-details">
                    <p><strong>Title:</strong> {eventDetails.title}</p>
                    <p><strong>Start Time:</strong> {eventDetails.startTime}</p>
                    <p><strong>Duration:</strong> {eventDetails.duration}</p>
                    <p><strong>Importance:</strong> {eventDetails.importance}</p>
                    <p><strong>Description:</strong> {eventDetails.description}</p>
                    <p><strong>Event Type:</strong> {eventDetails.eventType}</p>
                </div>
                <button onClick={() => onConfirm(eventDetails)}>Yes</button>
                <button onClick={onClose}>No</button>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
