import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/api';
import './NotificationsTab.css';

const NotificationsTab = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const data = await notificationService.getAll();
            setNotifications(data);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async () => {
        try {
            await notificationService.markAsRead();
            loadNotifications();
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await notificationService.delete(id);
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    if (loading) return <div className="loading">Cargando notificaciones...</div>;

    return (
        <div className="notifications-tab">
            <div className="notifications-header">
                <h2>Notificaciones</h2>
                {notifications.length > 0 && (
                    <button onClick={markAsRead} className="btn-secondary">
                        Marcar todas como leídas
                    </button>
                )}
            </div>

            <div className="notifications-list">
                {notifications.length === 0 ? (
                    <p className="no-notifications">No tienes notificaciones.</p>
                ) : (
                    notifications.map(notification => (
                        <div
                            key={notification._id}
                            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                        >
                            <div className="notification-content">
                                <span className={`type-badge ${notification.type}`}>
                                    {notification.type.replace('_', ' ')}
                                </span>
                                <p>{notification.message}</p>
                                <small>{new Date(notification.createdAt).toLocaleString()}</small>
                            </div>
                            <button
                                onClick={() => deleteNotification(notification._id)}
                                className="btn-delete"
                                title="Eliminar"
                            >
                                ×
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationsTab;
