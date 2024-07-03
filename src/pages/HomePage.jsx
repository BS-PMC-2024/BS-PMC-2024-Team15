import React, { useRef, useState } from 'react';
import './Home.css';
import CalendarComponent from '../Components/Calendar';
import EventsComponent from '../Components/Events';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import AIAssistantComponent from '../Components/AiChatForm'; // Import AI Assistant Component

const HomePage = () => {
    const calendarRef = useRef(null);
    const eventsRef = useRef(null);
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

    const toggleAIAssistant = () => {
        setShowAIAssistant(!showAIAssistant);
    };




    return (
        <div className="homepage">
            <Navbar />
            <div className="container">
                <Sidebar scrollToCalendar={scrollToCalendar} scrollToEvents={scrollToEvents} toggleAIAssistant={toggleAIAssistant} />
                <main className="main-content">
                    <div className="calendar" ref={calendarRef}>
                        <h2>Calendar</h2>
                        <div className="calendar-container">
                            <CalendarComponent />
                        </div>
                    </div>
                    <div className="events-section" ref={eventsRef}>
                        <EventsComponent />
                    </div>
                </main>
            </div>

            {/*AI Assistant component*/}
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
