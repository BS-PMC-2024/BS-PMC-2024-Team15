import React, { useState, useEffect } from 'react';
import './CourseForm.css';

const CourseFormModal = ({ isOpen, onClose, onSave, course }) => {
    const [name, setName] = useState('');
    const [instructor, setInstructor] = useState('');
    const [startDate, setStartDate] = useState('');
    const [duration, setDuration] = useState('1 month');
    const [level, setLevel] = useState('Beginner');
    const [description, setDescription] = useState('');
    const [days, setDays] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (course) {
            setName(course.name || '');
            setInstructor(course.instructor || '');
            setStartDate(course.startDate || '');
            setDuration(course.duration || '1 month');
            setLevel(course.level || 'Beginner');
            setDescription(course.description || '');
            setDays(course.days || {});
        } else {
            resetForm();
        }
    }, [course]);

    const validateForm = () => {
        let errors = {};

        if (name.length < 3) {
            errors.name = 'Course name must be at least 3 characters long';
        }

        if (instructor.length < 3) {
            errors.instructor = 'Instructor name must be at least 3 characters long';
        }

        const isValidDate = !isNaN(new Date(startDate).getTime());
        if (!isValidDate) {
            errors.startDate = 'Please enter a valid date';
        }

        if (description.length < 3) {
            errors.description = 'Description must be at least 3 characters long';
        }

        if (Object.keys(days).length === 0) {
            errors.days = 'Please select at least one day';
        } else {
            for (let day in days) {
                if (days[day].start === '' || days[day].end === '') {
                    errors.days = 'Please set start and finish times for each selected day';
                    break;
                }
            }
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        const formData = {
            id: course ? course.id : undefined,
            name,
            instructor,
            startDate,
            duration,
            level,
            description,
            days
        };

        onSave(formData);

    };

    const handleCheckboxChange = (day) => {
        setDays((prevDays) => {
            const newDays = { ...prevDays };
            if (newDays[day]) {
                delete newDays[day];
            } else {
                newDays[day] = { start: '', end: '' };
            }
            return newDays;
        });
    };

    const handleTimeChange = (day, type, time) => {
        setDays((prevDays) => ({
            ...prevDays,
            [day]: {
                ...prevDays[day],
                [type]: time,
            },
        }));
    };

    const resetForm = () => {
        setName('');
        setInstructor('');
        setStartDate('');
        setDuration('1 month');
        setLevel('Beginner');
        setDescription('');
        setDays({});
        setErrors({});
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{course ? 'Edit Course' : 'Add New Course'}</h2>
                <form >
                    <label>
                        Course Name:
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        {errors.name && <p className="error">{errors.name}</p>}
                    </label>
                    <label>
                        Instructor:
                        <input type="text" value={instructor} onChange={(e) => setInstructor(e.target.value)} />
                        {errors.instructor && <p className="error">{errors.instructor}</p>}
                    </label>
                    <label>
                        Start Date:
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        {errors.startDate && <p className="error">{errors.startDate}</p>}
                    </label>
                    <label>
                        Duration:
                        <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                            <option value="1 month">1 month</option>
                            <option value="2 months">2 months</option>
                            <option value="3 months">3 months</option>
                            <option value="6 months">6 months</option>
                        </select>
                    </label>
                    <label>
                        Level:
                        <select value={level} onChange={(e) => setLevel(e.target.value)}>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </label>
                    <label>
                        Description:
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                        {errors.description && <p className="error">{errors.description}</p>}
                    </label>
                    <label>
                        Days and Times:
                        <div className="checkbox-group">
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                                <div key={day} className="day-time">
                                    <label>
                                        <input
                                            type="checkbox"
                                            value={day}
                                            checked={days.hasOwnProperty(day)}
                                            onChange={() => handleCheckboxChange(day)}
                                        />
                                        {day}
                                    </label>
                                    {days.hasOwnProperty(day) && (
                                        <div>
                                            <label>
                                                Start:
                                                <input
                                                    type="time"
                                                    value={days[day].start}
                                                    onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                                                />
                                            </label>
                                            <label>
                                                Finish:
                                                <input
                                                    type="time"
                                                    value={days[day].end}
                                                    onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                                                />
                                            </label>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {errors.days && <p className="error">{errors.days}</p>}
                    </label>
                    <div className="modal-buttons">
                        <button onClick={handleSave}>{course ? 'Update Course' : 'Add Course'}</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseFormModal;
