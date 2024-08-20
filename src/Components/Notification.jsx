import React from 'react';
import './Notification.css';

const Notification = ({ notifications, onRemoveNotification }) => {
  return (

    <div className="notification-container">
      <h2>messages</h2>
      {notifications.map((notification) => (
        <div key={notification.id} className="notification-card">
          <p>{notification.message}</p>
          <button
            onClick={() => onRemoveNotification(notification.id)}
            className="dismiss-button"
          >
            Confirm
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notification;
