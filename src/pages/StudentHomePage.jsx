import React from 'react';
import CalendarComponent from '../Components/Calendar';
import EventsComponent from '../Components/Events';
import GraphComponent from '../Components/StatisticGraph';
import PostCarousel from '../Components/PostCarousel';
import CourseFormModal from '../Components/CourseForm'; // Import Course Form Modal
import CoursesComponent from '../Components/Courses'; // Import Courses Component

const StudentHomePage = ({ onOpenCourseModal, calendarRef, eventsRef, statisticsRef, events, loading, loadingCourses, fetchEvents, showAIAssistant, toggleAIAssistant, courses, fetchCourses, coursesRef }) => {
    return (
        <>
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

            <div ref={statisticsRef}>
                <h2>Statistics</h2>
                <GraphComponent events={events} loading={loading} fetchEvents={fetchEvents} />
            </div>
        </>
    );
};

export default StudentHomePage;
