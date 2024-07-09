import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../features/authSlice';
import { TEInput, TERipple } from 'tw-elements-react';
import './Login.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const status = useSelector((state) => state.auth.status);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    useEffect(() => {
        if (status === 'logged_in') {
            // navigate('/dashboard'); // Uncomment this line to redirect to the dashboard
        }
    }, [status, navigate]);

    return (
        <section className="login-section">
            <div className="login-container">
                <div className="login-image">
                    <img
                        src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                        alt="Sample"
                    />
                </div>
                <div className="login-form-container">
                    <form onSubmit={handleSubmit}>
                        <h2>Sign in</h2>
                        <label>Email address</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="remember-me">
                            <input type="checkbox" id="rememberMe" />
                            <label htmlFor="rememberMe">Remember me</label>
                        </div>
                        <a href="#!" className="forgot-password">Forgot password?</a>
                        <button type="submit">Login</button>
                        <p>
                            Don't have an account?
                            <a href="#!" className="register-link"> Register</a>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;
