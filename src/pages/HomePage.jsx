import React, { useRef } from 'react';
import './Home.css';
import CalendarComponent from '../Components/Calendar';
import EventsComponent from '../Components/Events';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';

const HomePage = () => {
    const calendarRef = useRef(null);
    const eventsRef = useRef(null);

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

    return (
        <div className="homepage">
            <Navbar />
            <div className="container">
                <Sidebar scrollToCalendar={scrollToCalendar} scrollToEvents={scrollToEvents} />
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
        </div>
    );
}

export default HomePage;
