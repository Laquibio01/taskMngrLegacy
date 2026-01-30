import React, { useState, useEffect } from 'react';
import { historyService, taskService } from '../../services/api';
import './HistoryTab.css';

const HistoryTab = () => {
  const [taskId, setTaskId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleLoadHistory = async () => {
    if (!taskId) {
      return;
    }

    setLoading(true);
    try {
      const data = await historyService.getByTask(taskId);
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
      alert('Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  // Load history when task changes
  useEffect(() => {
    if (taskId) {
      handleLoadHistory();
    }
  }, [taskId]);

  const handleLoadAllHistory = async () => {
    setLoading(true);
    setTaskId(''); // Clear specific task selection
    try {
      const data = await historyService.getAll(100);
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
      alert('Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="history-tab">
      <h2>Historial de Cambios</h2>

      <div className="form-section">
        <div className="form-group">
          <label>Filtrar por Tarea:</label>
          <select
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            className="task-select"
          >
            <option value="">-- Ver Todas las Tareas (Recientes) --</option>
            {tasks.map(task => (
              <option key={task._id} value={task._id}>
                {task.title}
              </option>
            ))}
          </select>
        </div>
        <div className="button-group">
          {!taskId && (
            <button onClick={handleLoadAllHistory} className="btn-secondary">Recargar Todos</button>
          )}
        </div>
      </div>

      <div className="history-section">
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : history.length === 0 ? (
          <div className="empty-state">No hay historial disponible</div>
        ) : (
          <div className="history-list">
            {history.map(entry => (
              <div key={entry._id} className="history-item">
                <div className="history-header">
                  <strong>Tarea: {entry.taskId?.title || entry.taskId || 'General/Eliminada'}</strong>
                  <span className="history-date">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="history-details">
                  <div><strong>Acción:</strong> {entry.action}</div>
                  <div><strong>Usuario:</strong> {entry.userId?.username || 'Desconocido'}</div>
                  {entry.oldValue && <div><strong>Antes:</strong> {entry.oldValue}</div>}
                  {entry.newValue && <div><strong>Después:</strong> {entry.newValue}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryTab;
