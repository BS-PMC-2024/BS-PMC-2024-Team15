import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import '../ComponentsCss/Navbar.css';
import EventFormModal from './EventForm';
import MyProfileForm from './MyProfileForm';
import CourseFormModal from './CourseForm';

const Navbar = ({ userType, fetchCourses, fetchPosts }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isEventFormOpen, setIsEventFormOpen] = useState(false);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // State for logout confirmation modal

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        dispatch(logout());
        navigate('/login');
    };

    const handleOpenProfile = () => setIsProfileModalOpen(true);
    const handleCloseProfile = () => setIsProfileModalOpen(false);
    const handleSaveProfile = () => {
        // Implement the logic to save profile data
    };

    const handleOpenEventForm = () => setIsEventFormOpen(true);
    const handleCloseEventForm = () => setIsEventFormOpen(false);

    const handleSaveEvent = async (eventData) => {
        try {
            const url = 'http://127.0.0.1:5000/add_post';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
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
        fetchPosts();
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
        fetchCourses();
        handleCloseCourseModal();
    };

    const handleOpenCourseModal = (course) => {
        setSelectedCourse(course);
        setIsCourseModalOpen(true);
    };

    const handleCloseCourseModal = () => {
        setIsCourseModalOpen(false);
        setSelectedCourse(null);
    };

    const handleOpenLogoutModal = () => setIsLogoutModalOpen(true); // Open logout confirmation modal
    const handleCloseLogoutModal = () => setIsLogoutModalOpen(false); // Close logout confirmation modal
    const confirmLogout = () => {
        handleLogout();
        setIsLogoutModalOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-buttons">
                <button className="nav-btn" onClick={handleOpenProfile}>
                    <img src="https://media.istockphoto.com/id/517998264/vector/male-user-icon.jpg?s=612x612&w=0&k=20&c=4RMhqIXcJMcFkRJPq6K8h7ozuUoZhPwKniEke6KYa_k=" alt="Profile" className="profile-img" />
                    My Profile
                </button>
                {userType !== "student" && <button className="nav-btn" onClick={handleOpenCourseModal}>Add Course</button>}
                {userType === "admin" && <button className="nav-btn" onClick={handleOpenEventForm}>Post Event</button>}
                <button className="nav-btn">About Us</button>
                <button className="nav-btn" onClick={handleOpenLogoutModal}>Logout</button>
            </div>

            <EventFormModal
                isOpen={isEventFormOpen}
                onClose={handleCloseEventForm}
                onSave={handleSaveEvent}
                event={null}
                slot={null}
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

            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <div className="modal-background">
                    <div className="modal-content">
                        <h2>Confirm Logout</h2>
                        <p>Are you sure you want to log out?</p>
                        <div className="modal-buttons">
                            <button className="modal-btn" onClick={confirmLogout}>Yes</button>
                            <button className="modal-btn" onClick={handleCloseLogoutModal}>No</button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
