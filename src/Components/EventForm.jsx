import React, { useState, useEffect } from 'react';
import './EventForm.css';

const EventFormModal = ({ isOpen, onClose, onSave, event, onUpdate }) => {
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [duration, setDuration] = useState('0:15');
    const [importance, setImportance] = useState('Medium');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (event) {
            setTitle(event.title || '');
            setStartTime(event.startTime || '');
            setDuration(event.duration || '0:15');
            setImportance(event.importance || 'Medium');
            setDescription(event.description || '');
        }
    }, [event]);

    const validateForm = () => {
        let errors = {};

        if (title.length < 3) {
            errors.title = 'Event name must be at least 3 characters long';
        }

        // Validate date-time format for startTime
        const isValidDateTime = !isNaN(new Date(startTime).getTime());
        if (!isValidDateTime) {
            errors.startTime = 'Please enter a valid date and time';
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            if (event) {
                // If event exists, update it
                await onUpdate({ ...event, title, startTime, duration, importance, description });
            } else {
                // Otherwise, add new event
                const response = await fetch('http://localhost:5000/add_event', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, startTime, duration, importance, description }),
                });

                if (!response.ok) {
                    throw new Error('Failed to add event');
                }
            }

            console.log('Event saved successfully');
            onSave(); // Notify parent to refresh events after saving
            onClose(); // Close the modal after saving
            resetForm(); // Clear form fields
        } catch (error) {
            console.error('Error saving event:', error);
            // Handle error (e.g., show error message)
        }
    };

    const resetForm = () => {
        setTitle('');
        setStartTime('');
        setDuration('0:15');
        setImportance('Medium');
        setDescription('');
        setErrors({});
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{event ? 'Edit Event' : 'Add New Event'}</h2>
                <form>
                    <label>
                        Event Name:
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                        {errors.title && <p className="error">{errors.title}</p>}
                    </label>
                    <label>
                        Date and Time:
                        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                        {errors.startTime && <p className="error">{errors.startTime}</p>}
                    </label>
                    <label>
                        Duration:
                        <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                            <option value="0:15">0:15</option>
                            <option value="0:30">0:30</option>
                            <option value="0:45">0:45</option>
                            <option value="1:00">1:00</option>
                        </select>
                    </label>
                    <label>
                        Importance:
                        <select value={importance} onChange={(e) => setImportance(e.target.value)}>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </label>
                    <label>
                        Description:
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                    </label>
                    <div className="modal-buttons">
                        <button type="button" onClick={handleSave}>{event ? 'Update Event' : 'Add Event'}</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventFormModal;
