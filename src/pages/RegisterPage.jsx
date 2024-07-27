import React, { useState } from 'react';
import './Register.css';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [type, setType] = useState('student');
    const [receiveNews, setReceiveNews] = useState(false);
    const [fullName, setFullName] = useState('');
    const [planDay, setPlanDay] = useState(0);
    const [stickSchedule, setStickSchedule] = useState(0);
    const [satesfiedTasks, setSatesfiedTasks] = useState(0);
    const [deadlinedTasks, setnDeadlinedTasks] = useState(0);
    const [prioritizeTasks, setPrioritizeTasks] = useState(0);


    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
                dateOfBirth,
                type,
                receiveNews,
                fullName,
                planDay,
                stickSchedule,
                satesfiedTasks,
                deadlinedTasks,
                prioritizeTasks
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data.message);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    };

    const renderRatingOptions = (stateSetter, selectedValue, name) => (
        <div className="rating-options">
            {[0, 1, 2, 3, 4, 5].map((value) => (
                <label key={value}>
                    <input
                        type="radio"
                        name={name}
                        value={value}
                        checked={selectedValue === value}
                        onChange={(e) => stateSetter(parseInt(e.target.value))}
                    />
                    {value}
                </label>
            ))}
        </div>
    );

    return (
        <section className="registration-section">
            <div className="registration-container">
                <div className="left-column">
                    <img
                        src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                        className="w-full"
                        alt="Sample image"
                    />
                </div>
                <div className="registration-form-container">
                    <h2>Register</h2>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="dateOfBirth">Date of Birth (optional)</label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                        />
                        <label htmlFor="type">Type</label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="student">Student</option>
                            <option value="lecturer">Lecturer</option>
                        </select>
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                        <label>How often do you plan your day in advance?</label>
                        {renderRatingOptions(setPlanDay, planDay, "planDay")}
                        <label>How well do you stick to your planned schedule?</label>
                        {renderRatingOptions(setStickSchedule, stickSchedule, "stickSchedule")}
                        <label>How effectively do you prioritize your tasks?</label>
                        {renderRatingOptions(setPrioritizeTasks, prioritizeTasks, "prioritizeTasks")}
                        <label>How often do you meet deadlines?</label>
                        {renderRatingOptions(setnDeadlinedTasks, deadlinedTasks, "deadlinedTasks")}
                        <label>How satisfied are you with your current time management skills?</label>
                        {renderRatingOptions(setSatesfiedTasks, satesfiedTasks, "satesfiedTasks")}
                        <div className="receive-emails">
                            <input
                                type="checkbox"
                                id="receiveNews"
                                checked={receiveNews}
                                onChange={(e) => setReceiveNews(e.target.checked)}
                            />
                            <label htmlFor="receiveNews">Interested in receiving news</label>
                        </div>
                        <button type="submit">Register</button>
                        <p>
                            Have an account? 
                            <a href="http://localhost:3000/login#!" className="register-link"> Login</a>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default RegisterPage;
