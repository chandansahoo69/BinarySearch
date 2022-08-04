import { useState } from "react";

export const useNotification = () => {
  const [showNotification, setShowNotification] = useState(false);

  // Turn off the notification
  const NotificationHandler = () => {
    // Show notification
    setShowNotification(true);
    const timeId = setTimeout(() => {
      // After 3 seconds close notification
      setShowNotification(false);
    }, 5000);

    // Clean up
    return () => {
      clearTimeout(timeId);
    };
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  return {
    showNotification,
    NotificationHandler,
    closeNotification,
  };
};
