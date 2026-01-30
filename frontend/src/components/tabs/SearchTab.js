import React, { useState, useEffect } from 'react';
import { taskService, projectService } from '../../services/api';
import './SearchTab.css';

const SearchTab = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({
    searchText: '',
    status: '',
    priority: '',
    projectId: '0'
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    try {
      const searchParams = {
        ...filters,
        projectId: filters.projectId === '0' ? null : filters.projectId
      };
      const data = await taskService.search(searchParams);
      setTasks(data);
    } catch (error) {
      console.error('Error searching tasks:', error);
      alert('Error al buscar tareas');
    }
  };

  return (
    <div className="search-tab">
      <h2>Búsqueda Avanzada</h2>

      <div className="form-section">
        <div className="form-grid">
          <div className="form-group">
            <label>Texto:</label>
            <input
              type="text"
              name="searchText"
              value={filters.searchText}
              onChange={handleFilterChange}
              placeholder="Buscar en título o descripción"
            />
          </div>
          <div className="form-group">
            <label>Estado:</label>
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">Todos</option>
              <option>Pendiente</option>
              <option>En Progreso</option>
              <option>Completada</option>
            </select>
          </div>
          <div className="form-group">
            <label>Prioridad:</label>
            <select name="priority" value={filters.priority} onChange={handleFilterChange}>
              <option value="">Todas</option>
              <option>Baja</option>
              <option>Media</option>
              <option>Alta</option>
              <option>Crítica</option>
            </select>
          </div>
          <div className="form-group">
            <label>Proyecto:</label>
            <select name="projectId" value={filters.projectId} onChange={handleFilterChange}>
              <option value="0">Todos</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>{project.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="button-group">
          <button onClick={handleSearch} className="btn-primary">Buscar</button>
        </div>
      </div>

      <div className="table-section">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Proyecto</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task._id}>
                <td>{task._id.slice(-6)}</td>
                <td>{task.title}</td>
                <td>{task.status}</td>
                <td>{task.priority}</td>
                <td>{task.projectId?.name || 'Sin proyecto'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {tasks.length === 0 && (
          <div className="empty-state">No se encontraron tareas</div>
        )}
      </div>
    </div>
  );
};

export default SearchTab;
