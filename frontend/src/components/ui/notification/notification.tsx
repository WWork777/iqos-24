"use client";

import { useNotification } from "@/context/NotificationContext";
import styles from "./notification.module.scss";

const Notification = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "📢";
    }
  };

  return (
    <div className={styles.notificationContainer}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${styles.notification} ${
            styles[`notification_${notification.type}`]
          }`}
          onClick={() => removeNotification(notification.id)}
        >
          <div className={styles.notification__icon}>
            {getIcon(notification.type)}
          </div>
          <div className={styles.notification__content}>
            <div className={styles.notification__title}>
              {notification.title}
            </div>
            {notification.message && (
              <div className={styles.notification__message}>
                {notification.message}
              </div>
            )}
          </div>
          <button
            className={styles.notification__close}
            onClick={() => removeNotification(notification.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notification;
