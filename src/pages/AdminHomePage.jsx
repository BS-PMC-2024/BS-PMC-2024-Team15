import React from 'react';
import PostCarousel from '../Components/PostCarousel';
import CoursesComponent from '../Components/Courses'; // Import Courses Component


const AdminHomePage = ({ onOpenCourseModal, calendarRef, eventsRef, statisticsRef, events, loading, loadingCourses, fetchEvents, showAIAssistant, toggleAIAssistant, courses, fetchCourses, coursesRef }) => {
    return (
        <>
             <div ref={coursesRef}>
                <h2>Courses</h2>
                <CoursesComponent courses={courses} loadingCourses={loadingCourses} fetchCourses={fetchCourses} />
            </div>
            <div>
                <h2>Recommended Events</h2>
                <PostCarousel fetchEvents={fetchEvents} />
            </div>
        </>
    );
};

export default AdminHomePage;
