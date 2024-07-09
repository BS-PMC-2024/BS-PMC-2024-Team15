import React, { useState } from 'react';
import { TEInput, TERipple } from 'tw-elements-react';
import './Register.css';


const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
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
  
                <button type="submit">Register</button>
              </form>
              {message && <p>{message}</p>}
              <p className="mt-2">Have an account? <a href="http://localhost:3000/login">Login</a></p>
            </div>
          </div>
        </section>
      );
    }

export default RegisterPage;
