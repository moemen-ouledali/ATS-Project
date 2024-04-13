// atsreact/src/Add-Ons/toast-notification-01/ToastNotification.js

import React from 'react';
import '../../Add-Ons/toast-notification-01/style.css'; // Make sure the path is correct
import checkCircleIcon from '../../Add-Ons/toast-notification-01/assets/check-circle.svg'; // Adjust path as necessary

const ToastNotification = ({ message, onClose }) => {
  // Automatically close the notification after 3 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="notification">
      <div className="notification__body">
        <img
          src={checkCircleIcon}
          alt="Success"
          className="notification__icon"
        />
        {message}
      </div>
      <div className="notification__progress"></div>
    </div>
  );
};

export default ToastNotification;
