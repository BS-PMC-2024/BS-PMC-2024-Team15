import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../ComponentsCss/Calendar.css';
import EventFormModal from './EventForm';
import CustomEventComponent from './CustomEventCalendarComponent'; // Import the custom component

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
        let borderLeft = '';
    

        if (end < now) {
           //if event has been ranked, return white color
            backgroundColor = '#000000';

        } else { switch (event.eventType) {
            case 'Study':
                backgroundColor = 'purple';
                break;
            case 'Social':
                backgroundColor = 'orange';
                break;
            case 'Hobby':
                backgroundColor = 'green';
                break;
            default:
                backgroundColor = '#3174ad';
                break;
        }
        }

        switch (event.importance) {
            case 'High':
                borderLeft = '8px solid #ff8888';
                break;
            case 'Medium':
                borderLeft = '8px solid yellow';
                break;
            case 'Low':
                borderLeft = '8px solid green';
                break;
            default:
                backgroundColor = '#3174ad';
                break;
        }
    
        const style = {
            backgroundColor: backgroundColor,
            borderLeft: borderLeft
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
