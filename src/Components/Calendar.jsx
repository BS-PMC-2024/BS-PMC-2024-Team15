import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css'; // Your custom CSS for calendar styling

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
    const [events, setEvents] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
        title: '',
        startTime: '',
        duration: '',
        importance: '',
        description: ''
    });

    useEffect(() => {
        // Fetch events from backend when component mounts
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:5000/get_events', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            if (response.ok) {
                const eventsData = await response.json();
                setEvents(eventsData.map(event => ({
                    ...event,
                    start: new Date(event.startTime),
                    end: moment(event.startTime).add(event.duration, 'minutes').toDate()
                })));
            } else {
                console.error('Failed to fetch events:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    
    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setShowPopup(true);
    };

    const handleNavigate = (date, view) => {
        setSelectedEvent(null); // Reset selected event when navigating
    };

    const eventStyleGetter = (event, start, end, isSelected) => {
        let backgroundColor = '#3174ad'; // Default color
        switch (event.importance) {
            case 'High':
                backgroundColor = '#e53935'; // Red for high importance
                break;
            case 'Medium':
                backgroundColor = '#ffb74d'; // Orange for medium importance
                break;
            case 'Low':
                backgroundColor = '#81c784'; // Green for low importance
                break;
            default:
                backgroundColor = '#3174ad'; // Default color
                break;
        }
    
        const style = {
            backgroundColor: backgroundColor,
            borderRadius: '100px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block',
        };
    
        return {
            style: style,
        };
    };
    

    const handleSelectSlot = (slotInfo) => {
        if (!slotInfo.action) {
            // Only show popup if no action (i.e., clicking on an empty slot)
            setNewEvent({ ...newEvent, startTime: slotInfo.start });
            setShowPopup(false); // Hide popup when clicking outside an event
        }
    };


    return (
        <div className="calendar-wrapper">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                views={['month', 'week', 'day']}
                selectable={true}
                defaultDate={new Date()}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                onView={(view) => console.log(view)}
                onNavigate={handleNavigate}
                eventPropGetter={eventStyleGetter}
            />
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        {selectedEvent && (
                            <>
                                <h3>{selectedEvent.title}</h3>
                                <p><strong>Start Time:</strong> {moment(selectedEvent.startTime).format('MMMM DD, YYYY HH:mm')}</p>
                                <p><strong>Duration:</strong> {selectedEvent.duration} minutes</p>
                                <p><strong>Importance:</strong> {selectedEvent.importance}</p>
                                <p><strong>Description:</strong> {selectedEvent.description}</p>
                            </>
                        )}
                        <button onClick={() => setShowPopup(false)} className="popup-btn">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarComponent;
