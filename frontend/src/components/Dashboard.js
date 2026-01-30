import React, { useState } from 'react';
import './Dashboard.css';
import TasksTab from './tabs/TasksTab';
import ProjectsTab from './tabs/ProjectsTab';
import CommentsTab from './tabs/CommentsTab';
import HistoryTab from './tabs/HistoryTab';
import NotificationsTab from './tabs/NotificationsTab';
import SearchTab from './tabs/SearchTab';
import ReportsTab from './tabs/ReportsTab';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('tasks');

  const tabs = [
    { id: 'tasks', label: 'Tareas' },
    { id: 'projects', label: 'Proyectos' },
    { id: 'comments', label: 'Comentarios' },
    { id: 'history', label: 'Historial' },
    { id: 'notifications', label: 'Notificaciones' },
    { id: 'search', label: 'Búsqueda' },
    { id: 'reports', label: 'Reportes' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tasks':
        return <TasksTab />;
      case 'projects':
        return <ProjectsTab />;
      case 'comments':
        return <CommentsTab />;
      case 'history':
        return <HistoryTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'search':
        return <SearchTab />;
      case 'reports':
        return <ReportsTab />;
      default:
        return <TasksTab />;
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Task Manager</h1>
        <div className="dashboard-user-info">
          <span>Usuario: <strong>{user.username}</strong></span>
          <button onClick={onLogout} className="btn-logout">Salir</button>
        </div>
      </header>

      <nav className="dashboard-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="dashboard-content">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default Dashboard;
