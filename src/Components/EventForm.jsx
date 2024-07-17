import React, { useState, useEffect } from 'react';
import './EventForm.css';

const EventFormModal = ({ isOpen, onClose, onSave, event, slot }) => {
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [duration, setDuration] = useState('0:15');
    const [importance, setImportance] = useState('Low');
    const [description, setDescription] = useState('');
    const [eventType, setEventType] = useState('Study');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (event) {
            setTitle(event.title || '');
            setStartTime(event.startTime || '');
            setDuration(event.duration || '0:15');
            setImportance(event.importance || 'Low');
            setDescription(event.description || '');
            setEventType(event.eventType || 'Study');
        } else if (slot) {
            setStartTime(slot.start); // Set startTime with the selected slot time
        } else {
            resetForm();
        }
    }, [event, slot]);

    const validateForm = () => {
        let errors = {};

        if (title.length < 3) {
            errors.title = 'Event name must be at least 3 characters long';
        }

        const isValidDateTime = !isNaN(new Date(startTime).getTime());
        if (!isValidDateTime) {
            errors.startTime = 'Please enter a valid date and time';
        }

        if (description.length < 3) {
            errors.description = 'Description must be at least 3 characters long';
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) {
            return;
        }

        const formData = {
            id: event ? event.id : null,
            title,
            startTime,
            duration,
            importance,
            description,
            eventType
        };

        onSave(formData);
    };

    const resetForm = () => {
        setTitle('');
        setStartTime(slot ? slot.start : '');
        setDuration('0:15');
        setImportance('Low');
        setDescription('');
        setEventType('Study');
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
                            <option value="1:15">1:15</option>
                            <option value="1:30">1:30</option>
                            <option value="1:45">1:45</option>
                            <option value="2:00">2:00</option>
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
                        Event Type:
                        <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                            <option value="Study">Study</option>
                            <option value="Social">Social</option>
                            <option value="Hobby">Hobby</option>
                        </select>
                    </label>
                    <label>
                        Description:
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                        {errors.description && <p className="error">{errors.description}</p>}
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
