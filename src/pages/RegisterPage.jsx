import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const iconList = [
    'https://cdn-icons-png.flaticon.com/512/167/167752.png',
    'https://cdn-icons-png.flaticon.com/512/2798/2798310.png',
    'https://cdn-icons-png.flaticon.com/512/5102/5102383.png',
    'https://cdn-icons-png.flaticon.com/512/5352/5352126.png',
    'https://cdn-icons-png.flaticon.com/512/3135/3135810.png',
    'https://cdn-icons-png.flaticon.com/512/2995/2995633.png',
    'https://cdn-icons-png.flaticon.com/512/2784/2784403.png',
    'https://cdn-icons-png.flaticon.com/512/6024/6024190.png'
];

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [icon, setIcon] = useState(iconList[0]);
    const [type, setType] = useState('student');
    const [receiveNews, setReceiveNews] = useState(false);
    const [fullName, setFullName] = useState('');
    const [planDay, setPlanDay] = useState(0);
    const [stickSchedule, setStickSchedule] = useState(0);
    const [satesfiedTasks, setSatesfiedTasks] = useState(0);
    const [deadlinedTasks, setnDeadlinedTasks] = useState(0);
    const [prioritizeTasks, setPrioritizeTasks] = useState(0);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fullName,
                dateOfBirth,
                gender,
                type,
                email,
                password,
                icon,
                receiveNews,
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
        navigate('/Login');
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
                <h2>Register</h2>
                <div className="registration-form-container">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                        <label htmlFor="dateOfBirth">Date of Birth (optional)</label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                        />
                        <label htmlFor="gender">Gender</label>
                        <select
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}

                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="else">Else</option>
                        </select>
                        <label htmlFor="type">Type</label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}


                        >
                            <option value="student">Student</option>
                            <option value="lecturer">Lecturer</option>
                        </select>
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
                        <label htmlFor="icon">Icon:</label>
                        <div className="icon-selector">
                            <div className="selected-icon" onClick={() => setIcon(!icon)}>
                                <img src={icon} alt="Selected Icon" style={{ width: '50px', height: '50px' }} />
                            </div>
                            <div className="icon-list">
                                {iconList.map((iconUrl, index) => (
                                    <div key={index} className="icon-item" onClick={() => setIcon(iconUrl)}>
                                        <img src={iconUrl} alt={`icon-${index}`} style={{ width: '50px', height: '50px', cursor: 'pointer' }} />
                                    </div>
                                ))}
                            </div>
                        </div>
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
