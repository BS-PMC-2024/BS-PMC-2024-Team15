import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import store from './store'; // Import your configured Redux store
import { getToken } from './features/tokenUtils.js'; // Import getToken function

function App() {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);


  //show user state 
  useEffect(() => {
    const token = getToken();
    if (token) {
      console.log('User logged in with token:', token);
      // Optionally dispatch an action to set user login status in Redux
    } else {
      console.log('User not logged in');
    }
  }, []);



  useEffect(() => {
    fetch("/users")
      .then(res => res.json())
      .then(data => {
        setData(data);
        console.log("Users DB - information");
        console.log(data);
      })
      .catch(error => console.error("Error fetching users:", error));
  }, []);


  
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
