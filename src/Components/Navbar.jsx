import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';  // Import the logout action
import '../ComponentsCss/Navbar.css';
import EventFormModal from './EventForm';  // Import EventFormModal
import MyProfileForm from './MyProfileForm';
import CourseFormModal from './CourseForm';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isEventFormOpen, setIsEventFormOpen] = useState(false); // Add state for event form modal

    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false); // State for Course modal
    const [selectedCourse, setSelectedCourse] = useState(null); // State for selected course

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        dispatch(logout());  // Dispatch the logout action to update Redux state
        navigate('/login');
    };

    const handleOpenProfile = () => {
        setIsProfileModalOpen(true); // Open profile modal
    };


    const handleCloseProfile = () => {
        setIsProfileModalOpen(false); // Close profile modal
    };

    const handleSaveProfile = () => {
        // Logic to save the profile data
    };

    const handleOpenEventForm = () => {
        setIsEventFormOpen(true); // Open event form modal
    };

    const handleCloseEventForm = () => {
        setIsEventFormOpen(false); // Close event form modal
    };

    const handleSaveEvent = async (eventData) => {
        try {
            // Define the URL of the endpoint
            const url = 'http://127.0.0.1:5000/add_post';

            // Send a POST request to the backend with the event data
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Include token if required
                },
                body: JSON.stringify(eventData),
            });

            // Check if the response is OK (status in the range 200-299)
            if (response.ok) {
                // Handle success
                const result = await response.json();
                console.log('Event added successfully:', result);
                // Optionally, you might want to show a success message or refresh data here
            } else {
                // Handle errors
                const error = await response.json();
                console.error('Error adding event:', error);
                // Optionally, you might want to show an error message here
            }
        } catch (error) {
            console.error('Network error:', error);
            // Optionally, you might want to show a network error message here
        }

        // Close the event form modal after saving
        handleCloseEventForm();
    };

    const handleSaveCourse = async (course) => {
        try {
            console.log(course);
            const url = 'http://127.0.0.1:5000/add_course';
    
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify(course),
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log('Course added successfully:', result);
            } else {
                const error = await response.json();
                console.error('Error adding course:', error);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    
        handleCloseCourseModal();
    };
    
    const handleOpenCourseModal = (course) => {
        setSelectedCourse(course);
        setIsCourseModalOpen(true); // Open Course modal
    };

    const handleCloseCourseModal = () => {
        setIsCourseModalOpen(false); // Close Course modal
        setSelectedCourse(null); // Reset selected course
    };


    return (
        <nav className="navbar">
            <div className="navbar-buttons">
                <button className="nav-btn" onClick={handleOpenCourseModal}>Courses</button>
                <button className="nav-btn" onClick={handleOpenEventForm}>Post Event-admin </button>
                <button className="nav-btn">About Us</button>
                <button className="nav-btn" onClick={handleOpenProfile}>My Profile</button>
                <button className="nav-btn" onClick={handleLogout}>Logout</button>
            </div>
            <EventFormModal
                isOpen={isEventFormOpen}
                onClose={handleCloseEventForm}
                onSave={handleSaveEvent}
                event={null} // Pass null since it's a new event
                slot={null}  // Pass null or appropriate slot value if needed
            />
            <MyProfileForm
                isOpen={isProfileModalOpen}
                onClose={handleCloseProfile}
                onSave={handleSaveProfile}
            />
            {/* Course Form modal */}

            <CourseFormModal
                isOpen={isCourseModalOpen}
                onClose={handleCloseCourseModal}
                onSave={handleSaveCourse}
                course={null}

            />

        </nav>
    );
}

export default Navbar;
