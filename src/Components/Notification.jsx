import React, { useState } from 'react';
import './Notification.css';

const NotificationDrawer = ({ notifications }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="hamburger-button" onClick={toggleDrawer}>
        &#9776;
      </button>
      {isOpen && <div className="backdrop" onClick={toggleDrawer}></div>}
      <div className={`notification-drawer ${isOpen ? 'open' : ''}`}>
        {notifications.map((notification, index) => (
          <div key={index} className="notification-card">
            <p>{notification.message}</p>
            <button className="dismiss-button">Dismiss</button>
          </div>
        ))}
      </div>
    </>
  );
};

export default NotificationDrawer;
