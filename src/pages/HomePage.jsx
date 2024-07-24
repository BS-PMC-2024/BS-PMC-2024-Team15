import React, { useRef, useState, useEffect } from 'react';
import './Home.css';
import CalendarComponent from '../Components/Calendar';
import EventsComponent from '../Components/Events';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import AIAssistantComponent from '../Components/AiChatForm';
import GraphComponent from '../Components/StatisticGraph';
import PostCarousel from '../Components/PostCarousel';
import StudentHomePage from './StudentHomePage';
import LecturerHomePage from './LecturerHomePage';
import AdminHomePage from './AdminHomePage';

const HomePage = () => {
    const calendarRef = useRef(null);
    const eventsRef = useRef(null);
    const statisticsRef = useRef(null);

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAIAssistant, setShowAIAssistant] = useState(false);
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        fetchEvents();
        fetchUserType();
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

    const fetchUserType = async () => {
        try {
            const idToken = localStorage.getItem('accessToken');
            if (!idToken) {
                throw new Error('No access token found');
            }

            const response = await fetch('http://localhost:5000/get_user_type', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ token: idToken })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user type');
            }

            const data = await response.json();
            setUserType(data.user_type);
        } catch (error) {
            console.error('Error fetching user type:', error);
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

    if (!userType) {
        return <div>Loading...</div>;
    }

    let UserHomePage;
    switch (userType) {
        case 'student':
            UserHomePage = StudentHomePage;
            break;
        case 'lecturer':
            UserHomePage = LecturerHomePage;
            break;
        case 'admin':
            UserHomePage = AdminHomePage;
            break;
        default:
            UserHomePage = () => <div>Unknown user type</div>;
    }

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
                    <UserHomePage
                        calendarRef={calendarRef}
                        eventsRef={eventsRef}
                        statisticsRef={statisticsRef}
                        events={events}
                        loading={loading}
                        fetchEvents={fetchEvents}
                        showAIAssistant={showAIAssistant}
                        toggleAIAssistant={toggleAIAssistant}
                    />
                </main>
            </div>

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
