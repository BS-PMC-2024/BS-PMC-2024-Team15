import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/authSlice';  
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data.message);
            if (data.message === "Login Successful") {
                localStorage.setItem('accessToken', data.access_token);
                // Dispatch the login action if you need to update Redux state
                dispatch(login({ token: data.access_token }));
                navigate('/home');
            } else {
                setMessage("Invalid credentials. Please try again.");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            setMessage("An error occurred. Please try again.");
        });
    };

    return (
        <section className="form-section">
            <div className="form-container login-container">
                <div className="login-image">
                    <img
                        src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                        alt="Sample"
                    />
                </div>
                <div className="form-content login-form-container">
                    <form onSubmit={handleSubmit}>
                        <h2>Sign in</h2>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                        <button type="submit">Login</button>
                        {message && <p>{message}</p>}
                        <p>
                            Don't have an account?
                            <a href="http://localhost:3000/Register#!" className="register-link"> Register</a>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;
