import React, { useState, useEffect } from 'react';
import { taskService, projectService, authService } from '../../services/api';
import './TasksTab.css';

const TasksTab = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pendiente',
    priority: 'Media',
    projectId: '',
    assignedTo: '',
    dueDate: '',
    estimatedHours: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksData, projectsData, usersData, statsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll(),
        authService.getUsers(),
        taskService.getStats()
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
      setUsers(usersData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectTask = (task) => {
    setSelectedTask(task._id);
    setFormData({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'Pendiente',
      priority: task.priority || 'Media',
      projectId: task.projectId?._id || '',
      assignedTo: task.assignedTo?._id || '',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      estimatedHours: task.estimatedHours || ''
    });
  };

  const handleAdd = async () => {
    if (!formData.title.trim()) {
      alert('El título es requerido');
      return;
    }

    try {
      const taskData = {
        ...formData,
        projectId: formData.projectId || null,
        assignedTo: formData.assignedTo || null,
        dueDate: formData.dueDate || null,
        estimatedHours: parseFloat(formData.estimatedHours) || 0
      };
      await taskService.create(taskData);
      clearForm();
      loadData();
      alert('Tarea agregada');
    } catch (error) {
      console.error('Error adding task:', error);
      alert(error.response?.data?.message || 'Error al agregar la tarea');
    }
  };

  const handleUpdate = async () => {
    if (!selectedTask) {
      alert('Selecciona una tarea');
      return;
    }

    if (!formData.title.trim()) {
      alert('El título es requerido');
      return;
    }

    try {
      const taskData = {
        ...formData,
        projectId: formData.projectId || null,
        assignedTo: formData.assignedTo || null,
        dueDate: formData.dueDate || null,
        estimatedHours: parseFloat(formData.estimatedHours) || 0
      };
      await taskService.update(selectedTask, taskData);
      clearForm();
      loadData();
      alert('Tarea actualizada');
    } catch (error) {
      console.error('Error updating task:', error);
      alert(error.response?.data?.message || 'Error al actualizar la tarea');
    }
  };

  const handleDelete = async () => {
    if (!selectedTask) {
      alert('Selecciona una tarea');
      return;
    }

    if (!window.confirm('¿Eliminar esta tarea?')) {
      return;
    }

    try {
      await taskService.delete(selectedTask);
      clearForm();
      loadData();
      alert('Tarea eliminada');
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Error al eliminar la tarea');
    }
  };

  const clearForm = () => {
    setSelectedTask(null);
    setFormData({
      title: '',
      description: '',
      status: 'Pendiente',
      priority: 'Media',
      projectId: '',
      assignedTo: '',
      dueDate: '',
      estimatedHours: ''
    });
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="tasks-tab">
      <h2>Gestión de Tareas</h2>

      <div className="form-section">
        <h3>Nueva/Editar Tarea</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Título:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Estado:</label>
            <select name="status" value={formData.status} onChange={handleInputChange}>
              <option>Pendiente</option>
              <option>En Progreso</option>
              <option>Completada</option>
              <option>Bloqueada</option>
              <option>Cancelada</option>
            </select>
          </div>
          <div className="form-group">
            <label>Prioridad:</label>
            <select name="priority" value={formData.priority} onChange={handleInputChange}>
              <option>Baja</option>
              <option>Media</option>
              <option>Alta</option>
              <option>Crítica</option>
            </select>
          </div>
          <div className="form-group">
            <label>Proyecto:</label>
            <select name="projectId" value={formData.projectId} onChange={handleInputChange}>
              <option value="">Sin proyecto</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>{project.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Asignado a:</label>
            <select name="assignedTo" value={formData.assignedTo} onChange={handleInputChange}>
              <option value="">Sin asignar</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.username}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Fecha Vencimiento:</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Horas Estimadas:</label>
            <input
              type="number"
              name="estimatedHours"
              value={formData.estimatedHours}
              onChange={handleInputChange}
              step="0.5"
              min="0"
            />
          </div>
        </div>
        <div className="button-group">
          <button onClick={handleAdd} className="btn-primary">Agregar</button>
          <button onClick={handleUpdate} className="btn-secondary">Actualizar</button>
          <button onClick={handleDelete} className="btn-danger">Eliminar</button>
          <button onClick={clearForm} className="btn-secondary">Limpiar</button>
        </div>
      </div>

      <div className="table-section">
        <h3>Lista de Tareas</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th>Proyecto</th>
                <th>Asignado</th>
                <th>Vencimiento</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr
                  key={task._id}
                  onClick={() => handleSelectTask(task)}
                  className={selectedTask === task._id ? 'selected' : ''}
                >
                  <td>{task._id.slice(-6)}</td>
                  <td>{task.title}</td>
                  <td>{task.status}</td>
                  <td>{task.priority}</td>
                  <td>{task.projectId?.name || 'Sin proyecto'}</td>
                  <td>{task.assignedTo?.username || 'Sin asignar'}</td>
                  <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sin fecha'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="stats-section">
        <strong>Estadísticas:</strong>
        <span>
          Total: {stats.total || 0} | 
          Completadas: {stats.completed || 0} | 
          Pendientes: {stats.pending || 0} | 
          Alta Prioridad: {stats.highPriority || 0} | 
          Vencidas: {stats.overdue || 0}
        </span>
      </div>
    </div>
  );
};

export default TasksTab;
