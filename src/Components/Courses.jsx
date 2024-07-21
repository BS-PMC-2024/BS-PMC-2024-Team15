import React, { useState, useEffect } from 'react';
import './Courses.css';
import CourseFormModal from './CourseForm'; // Import the modal component

const CoursesComponent = ({ onOpenCourseModal }) => {
    const [showCourseForm, setShowCourseForm] = useState(false); // State to manage modal visibility
    const [selectedCourse, setSelectedCourse] = useState(null); // State to store selected course for editing
    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true); // State to manage loading

    const toggleCourseForm = (course) => {
        setSelectedCourse(course); // Set selected course for editing
        setShowCourseForm(!showCourseForm); // Toggle modal visibility
    };

    const fetchCourses = async () => {
        try {
            const idToken = localStorage.getItem('accessToken');
            if (!idToken) {
                throw new Error('No access token found');
            }

            const response = await fetch('http://localhost:5000/get_courses', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }

            const data = await response.json();
            console.log('Fetched courses:', data); // Debug print
            setCourses(data);
            setLoadingCourses(false); // Set loadingCourses to false after fetching courses
        } catch (error) {
            console.error('Error fetching courses:', error);
            setLoadingCourses(false); // Set loadingCourses to false if there's an error
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleSaveCourse = async (course) => {
        try {
            const method = course.id ? 'PUT' : 'POST';
            const endpoint = course.id ? `update_course/${course.id}` : 'add_course';

            const response = await fetch(`http://localhost:5000/${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Ensure token is sent
                },
                body: JSON.stringify(course),
            });

            if (!response.ok) {
                throw new Error(`Failed to ${course.id ? 'update' : 'add'} course`);
            }

            setShowCourseForm(false); // Close the modal after saving
            fetchCourses(); // Refresh the courses list
        } catch (error) {
            console.error(`Error ${course.id ? 'updating' : 'adding'} course:`, error);
        }
    };

    const handleRemoveCourse = async (courseId) => {
        try {
            const response = await fetch(`http://localhost:5000/remove_course/${courseId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Ensure token is sent
                },
            });
            if (!response.ok) {
                throw new Error('Failed to remove course');
            }
            fetchCourses(); // Refresh courses after removing
        } catch (error) {
            console.error('Error removing course:', error);
        }
    };

    const getRowClassName = (level) => {
        switch (level) {
            case 'Advanced':
                return 'advanced-level';
            case 'Intermediate':
                return 'intermediate-level';
            case 'Beginner':
                return 'beginner-level';
            default:
                return '';
        }
    };

    return (
        <div className="courses">
            {loadingCourses ? (
                <p>Loading courses...</p>
            ) : (
                courses.length === 0 ? (
                    <h2>No Available Courses</h2>
                ) : (
                    <>
                        <h2>My Courses</h2>
                        <table className="courses-table">
                            <thead>
                                <tr>
                                    <th>Course Name</th>
                                    <th>Instructor</th>
                                    <th>Start Date</th>
                                    <th>Duration</th>
                                    <th>Level</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr key={course.id} className={getRowClassName(course.level)}>
                                        <td>{course.name}</td>
                                        <td>{course.instructor}</td>
                                        <td>{new Date(course.startDate).toLocaleDateString()}</td>
                                        <td>{course.duration}</td>
                                        <td>{course.level}</td>
                                        <td>
                                            <button className="edit-btn" onClick={() => toggleCourseForm(course)}>Edit</button>
                                            <button className="remove-btn" onClick={() => handleRemoveCourse(course.id)}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )
            )}
            <CourseFormModal
                isOpen={showCourseForm}
                onClose={() => setShowCourseForm(false)}
                onSave={handleSaveCourse}
                course={selectedCourse}
            />
        </div>
    );
};

export default CoursesComponent;
