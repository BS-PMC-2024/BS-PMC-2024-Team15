import React,{ useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';


function App() {

  const [data, setData] = useState([{}])


  useEffect(() => {
    fetch("/users").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data);
      }
    )
  }, [])
  return (
    <Router>
      <div className="App">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
