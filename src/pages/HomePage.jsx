import React, { useRef, useState, useEffect } from 'react';
import './Home.css';
import CalendarComponent from '../Components/Calendar';
import EventsComponent from '../Components/Events';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import AIAssistantComponent from '../Components/AiChatForm'; // Import AI Assistant Component
import GraphComponent from '../Components/StatisticGraph';
import EventPost from '../Components/EventPost';

const HomePage = () => {
    const calendarRef = useRef(null);
    const eventsRef = useRef(null);
    const statisticsRef = useRef(null); // Ref for statistics section

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state for events
    const [showAIAssistant, setShowAIAssistant] = useState(false); // State for AI Assistant visibility

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const idToken = localStorage.getItem('accessToken');
            if (!idToken) {
                throw new Error('No access token found');
            }

            const response = await fetch('http://localhost:5000/get_events', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }

            const data = await response.json();
            setEvents(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching events:', error);
            setLoading(false);
        }
    };

    const scrollToCalendar = () => {
        if (calendarRef.current) {
            calendarRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToEvents = () => {
        if (eventsRef.current) {
            eventsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToStatistics = () => {
        if (statisticsRef.current) {
            statisticsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const toggleAIAssistant = () => {
        setShowAIAssistant(!showAIAssistant);
    };

    return (
        <div className="homepage">
            <Navbar />
            <div className="container">
                <Sidebar
                    scrollToCalendar={scrollToCalendar}
                    scrollToEvents={scrollToEvents}
                    scrollToStatistics={scrollToStatistics}
                    toggleAIAssistant={toggleAIAssistant}
                />
                <main className="main-content">
                    <div className="calendar" ref={calendarRef}>
                        <h2>Calendar</h2>
                        <div className="calendar-container">
                            <CalendarComponent events={events} loading={loading} fetchEvents={fetchEvents} />
                        </div>
                    </div>
                    <div className="events-section" ref={eventsRef}>
                        <h2>Events</h2>
                        <EventsComponent events={events} loading={loading} fetchEvents={fetchEvents} />
                    </div>
                    <div>
                        <h2>Recommended Events</h2>
                        <EventPost />
                    </div>
                    <div ref={statisticsRef}>
                        <h2>Statistics</h2>
                        <GraphComponent events={events} loading={loading} fetchEvents={fetchEvents} />
                    </div>
                </main>
            </div>

            {/* AI Assistant component */}
            {showAIAssistant && (
                <AIAssistantComponent
                    isOpen={showAIAssistant}
                    onClose={toggleAIAssistant}
                />
            )}
        </div>
    );
};

export default HomePage;
