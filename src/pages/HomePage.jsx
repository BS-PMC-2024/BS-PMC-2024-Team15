import React, { useRef, useState, useEffect } from 'react';
import './Home.css';
import CalendarComponent from '../Components/Calendar';
import EventsComponent from '../Components/Events';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import AIAssistantComponent from '../Components/AiChatForm'; // Import AI Assistant Component
import GraphComponent from '../Components/StatisticGraph';
import CourseFormModal from '../Components/CourseForm'; // Import Course Form Modal
import CoursesComponent from '../Components/Courses'; // Import Courses Component

const HomePage = () => {
    const calendarRef = useRef(null);
    const eventsRef = useRef(null);
    const statisticsRef = useRef(null); // Ref for statistics section
    const coursesRef = useRef(null); // Ref for courses section

    const [events, setEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true); // Loading state for events
    const [showAIAssistant, setShowAIAssistant] = useState(false); // State for AI Assistant visibility
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false); // State for Course modal
    const [selectedCourse, setSelectedCourse] = useState(null); // State for selected course

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
            setLoadingEvents(false);
        } catch (error) {
            console.error('Error fetching events:', error);
            setLoadingEvents(false);
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

    const scrollToCourses = () => {
        if (coursesRef.current) {
            coursesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const toggleAIAssistant = () => {
        setShowAIAssistant(!showAIAssistant);
    };

    const handleOpenCourseModal = (course) => {
        setSelectedCourse(course);
        setIsCourseModalOpen(true); // Open Course modal
    };

    const handleCloseCourseModal = () => {
        setIsCourseModalOpen(false); // Close Course modal
        setSelectedCourse(null); // Reset selected course
    };

    const handleSaveCourse = async (course) => {
        try {
            const method = course.id ? 'PUT' : 'POST';
            const endpoint = course.id ? `update_course/${course.id}` : 'add_course';

            // Create a FormData object to handle file uploads
            const formData = new FormData();
            formData.append('name', course.name);
            formData.append('instructor', course.instructor);
            formData.append('startDate', course.startDate);
            formData.append('duration', course.duration);
            formData.append('level', course.level);
            formData.append('description', course.description);
            formData.append('days', course.description);
            if (course.photo) {
                formData.append('photo', course.photo);
            }

            const response = await fetch(`http://localhost:5000/${endpoint}`, {
                method,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Ensure token is sent
                },
                body: formData, // Use FormData for the body
            });

            if (!response.ok) {
                throw new Error(`Failed to ${course.id ? 'update' : 'add'} course`);
            }

            // Refresh courses after saving or updating
            setIsCourseModalOpen(false); // Close the modal after saving
        } catch (error) {
            console.error(`Error ${course.id ? 'updating' : 'adding'} course:`, error);
        }
    };

    return (
        <div className="homepage">
            <Navbar
                onOpenCourseModal={handleOpenCourseModal}
            />
            <div className="container">
                <Sidebar
                    scrollToCalendar={scrollToCalendar}
                    scrollToEvents={scrollToEvents}
                    scrollToStatistics={scrollToStatistics}
                    scrollToCourses={scrollToCourses} // Add scroll to courses
                    toggleAIAssistant={toggleAIAssistant}
                />
                <main className="main-content">
                    <div className="calendar" ref={calendarRef}>
                        <h2>Calendar</h2>
                        <div className="calendar-container">
                            <CalendarComponent events={events} loading={loadingEvents} fetchEvents={fetchEvents} />
                        </div>
                    </div>
                    <div className="events-section" ref={eventsRef}>
                        <h2>Events</h2>
                        <EventsComponent events={events} loading={loadingEvents} fetchEvents={fetchEvents} />
                    </div>
                    <div className="courses-section" ref={coursesRef}>
                        <h2>Courses</h2>
                        <CoursesComponent onOpenCourseModal={handleOpenCourseModal} />
                    </div>
                    <div ref={statisticsRef}>
                        <h2>Statistics</h2>
                        <GraphComponent events={events} loading={loadingEvents} fetchEvents={fetchEvents} />
                    </div>
                </main>
            </div>

            {/* Course Form modal */}
            {isCourseModalOpen && (
                <CourseFormModal
                    isOpen={isCourseModalOpen}
                    onClose={handleCloseCourseModal}
                    onSave={handleSaveCourse}
                    course={selectedCourse}
                />
            )}

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
