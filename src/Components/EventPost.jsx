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
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const idToken = localStorage.getItem('accessToken');
                if (!idToken) {
                    throw new Error('No access token found');
                }

                const url = 'http://localhost:5000/get_event_Posts'; // Make sure this matches your backend endpoint
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${idToken}`,
                        'Content-Type': 'application/json'
                    }
                });

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

    const handleAddToCalendar = (event) => {
        setSelectedEvent(event);
        setIsDialogOpen(true);
    };

    const handleConfirmAdd = async (event) => {
        try {
            const idToken = localStorage.getItem('accessToken');
            if (!idToken) {
                throw new Error('No access token found');
            }

            const url = 'http://localhost:5000/add_event';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setCalendarEvents((prevEvents) => [...prevEvents, { ...event, id: result.id }]);
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error adding event to calendar:', error);
        }
    };

    const handleEditPost = (event) => {
        setSelectedEvent(event);
        setEditMode(true);
        setIsDialogOpen(true);
    };

    const handleRemovePost = async (postId) => {
        try {
            const idToken = localStorage.getItem('accessToken');
            if (!idToken) {
                throw new Error('No access token found');
            }

            const url = `http://localhost:5000/remove_post/${postId}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setEvents((prevEvents) => prevEvents.filter(event => event.id !== postId));
        } catch (error) {
            console.error('Error removing post:', error);
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditMode(false);
    };

    const handleSavePost = async (eventData) => {
        try {
            const idToken = localStorage.getItem('accessToken');
            if (!idToken) {
                throw new Error('No access token found');
            }

            const url = editMode ? `http://localhost:5000/update_post/${selectedEvent.id}` : 'http://localhost:5000/add_event';
            const method = editMode ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (editMode) {
                setEvents((prevEvents) => prevEvents.map(event => event.id === selectedEvent.id ? { ...event, ...eventData } : event));
            } else {
                setEvents((prevEvents) => [...prevEvents, { ...eventData, id: result.id }]);
            }
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error saving post:', error);
        }
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
                            onEdit={handleEditPost}
                            onRemove={handleRemovePost}
                        />
                    ))}
                </Carousel>
            )}
            <ConfirmationDialog
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                onConfirm={handleSavePost}
                eventDetails={selectedEvent || {}}
                isEditMode={editMode}
            />
        </div>
    );
};

export default EventPost;
