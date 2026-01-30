import React, { useState } from 'react';
import { historyService } from '../../services/api';
import './HistoryTab.css';

const HistoryTab = () => {
  const [taskId, setTaskId] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLoadHistory = async () => {
    if (!taskId) {
      alert('ID de tarea requerido');
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

  const handleLoadAllHistory = async () => {
    setLoading(true);
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
          <label>ID Tarea:</label>
          <input
            type="text"
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            placeholder="Ingresa el ID de la tarea"
          />
        </div>
        <div className="button-group">
          <button onClick={handleLoadHistory} className="btn-primary">Cargar Historial</button>
          <button onClick={handleLoadAllHistory} className="btn-secondary">Cargar Todo el Historial</button>
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
                  <strong>Tarea #{entry.taskId?.title || entry.taskId}</strong>
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
