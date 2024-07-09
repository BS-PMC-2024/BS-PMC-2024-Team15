import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../features/authSlice';
import { TEInput, TERipple } from 'tw-elements-react';
import './Login.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const status = useSelector((state) => state.auth.status);


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
            if (data.message !== "Invalid credentials.") {
                //Make shure token is stored succecfully**
                localStorage.setItem('accessToken', data.access_token);
                //homepage redirect 
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
                        {/* <div className="checkbox-container remember-me">
                            <input type="checkbox" id="rememberMe" />
                             <label htmlFor="rememberMe">Remember me</label> </>  
                        </div>
                        <a href="#!" className="forgot-password">Forgot password?</a>*/}
                        <button type="submit">Login</button>
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


