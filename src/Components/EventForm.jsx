import React, { useState } from 'react';
import './EventForm.css';



const EventFormModal = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [duration, setDuration] = useState('');
    const [importance, setImportance] = useState('1');
    const [description, setDescription] = useState('');

    const handleSave = () => {
        //gettint event data from Form - returning to sidebar - handlesave event
        onSave({ title, startTime, duration, importance, description });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add New Event</h2>
                <form>
                    <label>
                        Event Name:
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </label>
                    <label>
                        Date and Time:
                        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                    </label>
                    <label>
                        Duration:
                        <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                            <option value="0:15">0:15</option>
                            <option value="0:30">0:30</option>
                            <option value="0:45">0:45</option>
                            <option value="1:00">1:00</option>
                        </select>
                        <input
                            type="text"
                            placeholder="or enter manually"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </label>
                    <label>
                        Importance:
                        <select value={importance} onChange={(e) => setImportance(e.target.value)}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </label>
                    <label>
                        Description:
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                        ></textarea>
                    </label>
                    <div className="modal-actions">
                        <button type="button" onClick={handleSave}>Confirm</button>
                        <button type="button" onClick={onClose}>Back</button>
                    </div>
                </form>
            </div>
        </div>
    );
}



export default EventFormModal;
