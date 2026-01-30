import React, { useState } from 'react';
import './Dashboard.css';
import TasksTab from './tabs/TasksTab';
import ProjectsTab from './tabs/ProjectsTab';
import CommentsTab from './tabs/CommentsTab';
import HistoryTab from './tabs/HistoryTab';
import NotificationsTab from './tabs/NotificationsTab';
import SearchTab from './tabs/SearchTab';
import ReportsTab from './tabs/ReportsTab';
import useKonamiCode from '../hooks/useKonamiCode';
import PacmanGame from './game/PacmanGame';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  // Easter Egg Trigger
  useKonamiCode(() => {
    setShowEasterEgg(true);
  });

  const tabs = [
    { id: 'tasks', label: 'Tareas', icon: '📝' },
    { id: 'projects', label: 'Proyectos', icon: '🚀' },
    { id: 'comments', label: 'Comentarios', icon: '💬' },
    { id: 'history', label: 'Historial', icon: '🕒' },
    { id: 'notifications', label: 'Notificaciones', icon: '🔔' },
    { id: 'search', label: 'Búsqueda', icon: '🔍' },
    { id: 'reports', label: 'Reportes', icon: '📊' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tasks': return <TasksTab />;
      case 'projects': return <ProjectsTab />;
      case 'comments': return <CommentsTab />;
      case 'history': return <HistoryTab />;
      case 'notifications': return <NotificationsTab />;
      case 'search': return <SearchTab />;
      case 'reports': return <ReportsTab />;
      default: return <TasksTab />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Easter Egg Overlay */}
      {showEasterEgg && <PacmanGame onClose={() => setShowEasterEgg(false)} />}

      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="app-title">Task Mngr</h1>
          <div className="user-profile">
            <div className="avatar">{user.username.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <span className="username">{user.username}</span>
              <span className="role">Admin</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="icon">{tab.icon}</span>
              <span className="label">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={onLogout} className="btn-logout-sidebar">
            <span className="icon">🚪</span> Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <h2>{tabs.find(t => t.id === activeTab)?.label}</h2>
          <div className="header-actions">
            {/* Toolbar */}
          </div>
        </header>
        <div className="content-scrollable">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
