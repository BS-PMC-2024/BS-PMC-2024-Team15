import React, { useState } from 'react';
import './Register.css';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [type, setType] = useState('student');
    const [receiveNews, setReceiveNews] = useState(false);
    const [fullName, setFullName] = useState('');
    const [avgStudyHours, setAvgStudyHours] = useState('');
    const [avgStudyEfficiency, setAvgStudyEfficiency] = useState('');
    const [message, setMessage] = useState('');

    const [planDay, setPlanDay] = useState(0);
    const [stickSchedule, setStickSchedule] = useState(0);
    const [controlTime, setControlTime] = useState(0);
    const [meetDeadlines, setMeetDeadlines] = useState(0);
    const [prioritizeTasks, setPrioritizeTasks] = useState(0);
    const [feelProductive, setFeelProductive] = useState(0);
    const [manageDistractions, setManageDistractions] = useState(0);

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
                avgStudyHours,
                avgStudyEfficiency,
                planDay,
                stickSchedule,
                controlTime,
                meetDeadlines,
                prioritizeTasks,
                feelProductive,
                manageDistractions,
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            setMessage(data.message);
        })
        .catch((error) => {
            console.error("Error:", error);
            setMessage("An error occurred. Please try again.");
        });
    };

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
                        <label htmlFor="avgStudyHours">Estimated Avg Study Hours Per Week</label>
                        <input
                            type="number"
                            id="avgStudyHours"
                            value={avgStudyHours}
                            onChange={(e) => setAvgStudyHours(e.target.value)}
                            required
                        />
                        <label htmlFor="avgStudyEfficiency">Estimated Avg Study Efficiency (0-100%)</label>
                        <input
                            type="number"
                            id="avgStudyEfficiency"
                            value={avgStudyEfficiency}
                            onChange={(e) => setAvgStudyEfficiency(e.target.value)}
                            required
                            min="0"
                            max="100"
                        />
                        <label htmlFor="planDay">How often do you plan your day in advance?</label>
                        <input
                            type="number"
                            id="planDay"
                            value={planDay}
                            onChange={(e) => setPlanDay(e.target.value)}
                            required
                            min="0"
                            max="5"
                        />
                        <label htmlFor="stickSchedule">How well do you stick to your planned schedule?</label>
                        <input
                            type="number"
                            id="stickSchedule"
                            value={stickSchedule}
                            onChange={(e) => setStickSchedule(e.target.value)}
                            required
                            min="0"
                            max="5"
                        />
                        <label htmlFor="controlTime">How often do you feel in control of your time?</label>
                        <input
                            type="number"
                            id="controlTime"
                            value={controlTime}
                            onChange={(e) => setControlTime(e.target.value)}
                            required
                            min="0"
                            max="5"
                        />
                        <label htmlFor="meetDeadlines">How often do you meet deadlines without stress?</label>
                        <input
                            type="number"
                            id="meetDeadlines"
                            value={meetDeadlines}
                            onChange={(e) => setMeetDeadlines(e.target.value)}
                            required
                            min="0"
                            max="5"
                        />
                        <label htmlFor="prioritizeTasks">How effectively do you prioritize your tasks?</label>
                        <input
                            type="number"
                            id="prioritizeTasks"
                            value={prioritizeTasks}
                            onChange={(e) => setPrioritizeTasks(e.target.value)}
                            required
                            min="0"
                            max="5"
                        />
                        <label htmlFor="feelProductive">How often do you feel productive during your work/study sessions?</label>
                        <input
                            type="number"
                            id="feelProductive"
                            value={feelProductive}
                            onChange={(e) => setFeelProductive(e.target.value)}
                            required
                            min="0"
                            max="5"
                        />
                        <label htmlFor="manageDistractions">How well do you manage distractions?</label>
                        <input
                            type="number"
                            id="manageDistractions"
                            value={manageDistractions}
                            onChange={(e) => setManageDistractions(e.target.value)}
                            required
                            min="0"
                            max="5"
                        />
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
                        {message && <p className="error-message">{message}</p>}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default RegisterPage;
