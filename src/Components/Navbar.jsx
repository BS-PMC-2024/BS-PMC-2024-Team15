import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';  // Import the logout action
import '../ComponentsCss/Navbar.css';
import EventFormModal from './EventForm';  // Import EventFormModal
import MyProfileForm from './MyProfileForm';
import CourseFormModal from './CourseForm';

const Navbar = ({ userType }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isEventFormOpen, setIsEventFormOpen] = useState(false); // Add state for event form modal
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
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
            const url = 'http://127.0.0.1:5000/add_post';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Include token if required
                },
                body: JSON.stringify(eventData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Event added successfully:', result);
            } else {
                const error = await response.json();
                console.error('Error adding event:', error);
            }
        } catch (error) {
            console.error('Network error:', error);
        }

        handleCloseEventForm();
    };

    const handleSaveCourse = async (course) => {
        try {
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

    const handleCloseLogoutModal = () => {
        setIsLogoutModalOpen(false);
    };

    const handleOpenLogoutModal = () => {
        setIsLogoutModalOpen(true);
    };

    return (
        <nav className="navbar">
            <div className="navbar-buttons">
                <button className="nav-btn" onClick={handleOpenProfile}>
                    <img src="https://media.istockphoto.com/id/517998264/vector/male-user-icon.jpg?s=612x612&w=0&k=20&c=4RMhqIXcJMcFkRJPq6K8h7ozuUoZhPwKniEke6KYa_k=" alt="Profile" className="profile-img" />
                    My Profile
                </button>
                {userType != "student" && <button className="nav-btn" onClick={handleOpenCourseModal}>Add Course</button>}
                {userType === "admin" && <button className="nav-btn" onClick={handleOpenEventForm}>Post Event </button>}
                <button className="nav-btn">About Us</button>

                <button className="nav-btn" onClick={handleOpenLogoutModal}>Logout</button>
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
            <CourseFormModal
                isOpen={isCourseModalOpen}
                onClose={handleCloseCourseModal}
                onSave={handleSaveCourse}
                course={null}
            />
            {isLogoutModalOpen && (
                <div className="logout-modal">
                    <div className="logout-modal-content">
                        <p>Are you sure you want to logout?</p>
                        <button onClick={handleLogout}>Yes</button>
                        <button onClick={handleCloseLogoutModal}>No</button>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
