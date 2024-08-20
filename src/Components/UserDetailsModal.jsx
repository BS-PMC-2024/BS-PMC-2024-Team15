import React from 'react';

const UserDetailsModal = ({ user, onClose }) => {
    // Calculate the average quiz score
    const averageQuizScore = (
        (user.stickSchedule +
         user.satesfiedTasks +
         user.deadlinedTasks +
         user.prioritizeTasks +
         user.planDay) / 5
    ).toFixed(2); // Round to 2 decimal places

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>User Details</h2>
                <p><strong>Full Name:</strong> {user.fullName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Date of Birth:</strong> {user.dateOfBirth}</p>
                <p><strong>User Type:</strong> {user.type}</p>
                <p><strong>Gender:</strong> {user.gender}</p>
                <p><strong>Receive News:</strong> {user.receiveNews ? "Yes" : "No"}</p>
                <p><strong>Plan Day:</strong> {user.planDay}</p>
                <p><strong>Stick to Schedule:</strong> {user.stickSchedule}</p>
                <p><strong>Task Satisfaction:</strong> {user.satesfiedTasks}</p>
                <p><strong>Deadline Management:</strong> {user.deadlinedTasks}</p>
                <p><strong>Prioritize Tasks:</strong> {user.prioritizeTasks}</p>
                <p><strong>Average Quiz Score:</strong> {averageQuizScore}</p>
                <p><strong>Courses:</strong> {user.courses.join(', ')}</p>
                <p><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                <button  onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default UserDetailsModal;
