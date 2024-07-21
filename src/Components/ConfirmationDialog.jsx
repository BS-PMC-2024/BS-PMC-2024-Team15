import React, { useState, useEffect } from 'react';
import './ConfirmationDialog.css'; // Ensure the CSS file is correct

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, eventDetails, isEditMode }) => {
    const [formData, setFormData] = useState({
        title: '',
        startTime: '',
        duration: '',
        importance: '',
        description: '',
        eventType: ''
    });

    useEffect(() => {
        if (eventDetails) {
            setFormData({
                title: eventDetails.title || '',
                startTime: eventDetails.startTime || '',
                duration: eventDetails.duration || '',
                importance: eventDetails.importance || '',
                description: eventDetails.description || '',
                eventType: eventDetails.eventType || ''
            });
        }
    }, [eventDetails]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(formData);
    };

    return (
        isOpen && (
            <div className="confirmation-dialog">
                <div className="confirmation-dialog-content">
                    <h2>{isEditMode ? 'Edit Post' : 'View Post'}</h2>
                    {isEditMode ? (
                        <form onSubmit={handleSubmit}>
                            <label>
                                Title:
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                Start Time:
                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                Duration:
                                <select
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    required
                                >
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
                                <select
                                    name="importance"
                                    value={formData.importance}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </label>
                            <label>
                                Event Type:
                                <select
                                    name="eventType"
                                    value={formData.eventType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Study">Study</option>
                                    <option value="Social">Social</option>
                                    <option value="Hobby">Hobby</option>
                                </select>
                            </label>
                            <label>
                                Description:
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <div className="dialog-actions">
                                <button type="submit">Save Changes</button>
                                <button type="button" onClick={onClose}>Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <p><strong>Title:</strong> {formData.title}</p>
                            <p><strong>Start Time:</strong> {formData.startTime}</p>
                            <p><strong>Duration:</strong> {formData.duration}</p>
                            <p><strong>Importance:</strong> {formData.importance}</p>
                            <p><strong>Description:</strong> {formData.description}</p>
                            <p><strong>Event Type:</strong> {formData.eventType}</p>
                            <div className="dialog-actions">
                                <button type="button" onClick={() => onConfirm(formData)}>Confirm</button>
                                <button type="button" onClick={onClose}>Close</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    );
};

export default ConfirmationDialog;
