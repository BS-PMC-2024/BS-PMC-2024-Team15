import React, { useRef, useState } from 'react';
import './Home.css';
import CalendarComponent from '../Components/Calendar';
import EventsComponent from '../Components/Events';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import AIAssistantComponent from '../Components/AiChatForm'; // Import AI Assistant Component
import GraphComponent from '../Components/StatisticGraph';
const HomePage = () => {
    const calendarRef = useRef(null);
    const eventsRef = useRef(null);
    const statisticsRef = useRef(null); // Ref for statistics section

    const [showAIAssistant, setShowAIAssistant] = useState(false); // State for AI Assistant visibility

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
                            <CalendarComponent />
                        </div>
                    </div>
                    <div className="events-section" ref={eventsRef}>
                        <h2>Events</h2>
                        <EventsComponent />
                    </div>
                    <div ref={statisticsRef}>
                        <h2>Statistics</h2>
                        <GraphComponent />
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
