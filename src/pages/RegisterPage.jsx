import React, { useState } from 'react';
import './Register.css';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [type, setType] = useState('student');
    const [receiveNews, setReceiveNews] = useState(false);
    const [message, setMessage] = useState('');

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
                        {message && <p className="error-message">{message}</p>}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default RegisterPage;
