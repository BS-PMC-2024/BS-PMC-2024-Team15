import React from 'react';
import PostCarousel from '../Components/PostCarousel';
import CoursesComponent from '../Components/Courses'; // Import Courses Component


const AdminHomePage = ({userType,  loadingCourses, fetchEvents, showAIAssistant, toggleAIAssistant, fetchPosts,courses, fetchCourses, coursesRef ,posts,loadingPosts }) => {
    return (
        <>
             <div ref={coursesRef}>
                <h2>Courses</h2>
                <CoursesComponent fetchEvents={fetchEvents} courses={courses} loadingCourses={loadingCourses} fetchCourses={fetchCourses} />
            </div>
            <div>
                <h2>Recommended Events</h2>
                <PostCarousel posts={posts} loadingPosts={loadingPosts} fetchPosts={fetchPosts} fetchEvents={fetchEvents} userType={userType}/>
            </div>
            
        </>
    );
};

export default AdminHomePage;
