import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';
import EventFormModal from './EventForm';
import CustomEventComponent from './CustomEventComponent'; // Import the custom component

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ events, fetchEvents }) => {
    const [showEventForm, setShowEventForm] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        if (!events || events.length === 0) {
            fetchEvents();
        }
    }, [events, fetchEvents]);

    const eventStyleGetter = (event, start, end, isSelected) => {
        const now = new Date();
        let backgroundColor = '#3174ad';
    
        if (end < now) {
            backgroundColor = '#000000';
        } else {
            switch (event.importance) {
                case 'High':
                    backgroundColor = '#e53935';
                    break;
                case 'Medium':
                    backgroundColor = '#ffb74d';
                    break;
                case 'Low':
                    backgroundColor = '#81c784';
                    break;
                default:
                    backgroundColor = '#3174ad';
                    break;
            }
        }
    
        const style = {
            backgroundColor: backgroundColor,
            borderRadius: '4px',
            opacity: 0.8,
            color: 'white',
            border: 'none',
            padding: '2px 4px',
        };
    
        return {
            style: style,
            tooltip: event.additionalInfo // Set tooltip text or other details
        };
    };
    
    
    const handleSelectSlot = (slotInfo) => {
        setSelectedSlot(slotInfo.start);
        setSelectedEvent(null);
        setShowEventForm(true);
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setSelectedSlot(null);
        setShowEventForm(true);
    };

    const handleCloseEventForm = () => {
        setShowEventForm(false);
        setSelectedEvent(null);
        setSelectedSlot(null);
    };

    const handleSaveEvent = async (formData) => {
        try {
            const idToken = localStorage.getItem('accessToken');
            const requestOptions = {
                method: formData.id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify(formData)
            };

            let url = formData.id ? `http://localhost:5000/update_event/${formData.id}` : 'http://localhost:5000/add_event';
            const response = await fetch(url, requestOptions);

            fetchEvents();
            handleCloseEventForm();
        } catch (error) {
            console.error('Error saving or updating event:', error);
        }
    };

    return (
        <div className="calendar-wrapper">
            <Calendar
                localizer={localizer}
                events={events.map(event => ({
                    ...event,
                    start: new Date(event.startTime),
                    end: moment(event.startTime).add(event.duration, 'minutes').toDate()
                }))}
                startAccessor="start"
                endAccessor="end"
                views={['month', 'week', 'day']}
                selectable={true}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                style={{ height: 500 }}
                eventPropGetter={eventStyleGetter}
                components={{
                    event: CustomEventComponent, // Use the custom event component
                }}
            />
            <EventFormModal
                isOpen={showEventForm}
                onClose={handleCloseEventForm}
                onSave={handleSaveEvent}
                event={selectedEvent ? { ...selectedEvent, startTime: moment(selectedEvent.start).format('YYYY-MM-DDTHH:mm') } : null}
                slot={selectedSlot ? { start: moment(selectedSlot).format('YYYY-MM-DDTHH:mm') } : null}
            />
        </div>
    );
};

export default CalendarComponent;
