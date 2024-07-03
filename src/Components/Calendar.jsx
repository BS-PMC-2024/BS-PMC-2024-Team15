import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

const CalendarComponent = () => {
    const [date, setDate] = useState(new Date());
    const [showPopup, setShowPopup] = useState(false);

    //onclick on date
    const onChange = date => {
        setDate(date);
        setShowPopup(true); // Show popup when a date is selected
    };

    //close popup
    const handleClosePopup = () => {
        setShowPopup(false);
    };

    //yes- add new event
    const handleAddEvent = () => {
        // Add event logic here
        setShowPopup(false);
        alert('Event added!');
    };

    return (
        <div className="calendar-wrapper">
            <Calendar onChange={onChange} value={date} />
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>Add Event</h3>
                        <p>Do you want to add an event on {date.toDateString()}?</p>
                        <button onClick={handleAddEvent} className="popup-btn">Yes</button>
                        <button onClick={handleClosePopup} className="popup-btn">No</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CalendarComponent;