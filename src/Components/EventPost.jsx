// EventPost.js
import React, { useState, useEffect } from 'react';
import './EventPost.css';
import EventCard from './EventCard'; // Ensure this import is correct
import ConfirmationDialog from './ConfirmationDialog'; // Import the new dialog component

const Carousel = ({ children }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slidesToShow = 3; // Number of slides to show at once

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(children.length / slidesToShow));
    };

    const prevSlide = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + Math.ceil(children.length / slidesToShow)) % Math.ceil(children.length / slidesToShow)
        );
    };

    return (
        <div className="carousel">
            <button onClick={prevSlide} className="carousel-control prev">❮</button>
            <div className="carousel-slides">
                <div
                    className="carousel-wrapper"
                    style={{
                        transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`
                    }}
                >
                    {children}
                </div>
            </div>
            <button onClick={nextSlide} className="carousel-control next">❯</button>
        </div>
    );
};

const EventPost = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const idToken = localStorage.getItem('accessToken');
                if (!idToken) {
                    throw new Error('No access token found');
                }

                const url = 'http://localhost:5000/get_event_Posts'; // Make sure this matches your backend endpoint
                console.log('Fetching events from:', url);

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${idToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching event posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleAddToCalendar = async (event) => {
        setSelectedEvent(event);
        setIsDialogOpen(true);
    };

    const handleConfirmAdd = async (event) => {
        try {
            const idToken = localStorage.getItem('accessToken');
            if (!idToken) {
                throw new Error('No access token found');
            }

            const url = 'http://localhost:5000/add_event'; // Backend endpoint
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: event.title,
                    startTime: event.startTime,
                    duration: event.duration,
                    importance: event.importance,
                    description: event.description,
                    eventType: event.eventType
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Event added successfully:', result);

            // Optionally, update local state to reflect the change
            setCalendarEvents((prevEvents) => [...prevEvents, { ...event, id: result.id }]);
            setIsDialogOpen(false); // Close the dialog
        } catch (error) {
            console.error('Error adding event to calendar:', error);
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    return (
        <div className="event-post">
            <h2>Social Events</h2>
            {loading ? (
                <p>Loading events...</p>
            ) : (
                <Carousel>
                    {events.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onAddToCalendar={handleAddToCalendar}
                        />
                    ))}
                </Carousel>
            )}
            <ConfirmationDialog
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                onConfirm={handleConfirmAdd}
                eventDetails={selectedEvent || {}}
            />
        </div>
    );
};

export default EventPost;
