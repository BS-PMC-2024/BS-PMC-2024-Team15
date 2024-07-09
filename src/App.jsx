import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import store from './store'; // Import your configured Redux store
import { getToken } from './features/tokenUtils.js'; // Import getToken function

function App() {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);

  //see if user is logged in function
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        // Here you could decode the token or fetch user info if needed
        console.log("User logged in. Email:", getUserEmailFromToken(accessToken)); // Replace with actual decoding or fetching logic
    } else {
        console.log("No user logged in.");
    }
}, []);

const getUserEmailFromToken = (token) => {
    // Implement your logic to decode the token and extract user email
    return "example@example.com";  // Replace with actual decoding logic
};


  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
