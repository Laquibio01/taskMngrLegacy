import React, { useState, useEffect } from 'react';
import { projectService } from '../../services/api';
import './ProjectsTab.css';

const ProjectsTab = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setLoading(true);
        try {
            const data = await projectService.getAll();
            setProjects(data);
        } catch (error) {
            console.error('Error loading projects:', error);
            alert('Error al cargar proyectos');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedProject) {
                await projectService.update(selectedProject._id, formData);
                alert('Proyecto actualizado');
            } else {
                await projectService.create(formData);
                alert('Proyecto creado');
            }
            clearForm();
            loadProjects();
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Error al guardar el proyecto');
        }
    };

    const handleEdit = (project) => {
        setSelectedProject(project);
        setFormData({
            name: project.name,
            description: project.description || ''
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este proyecto?')) return;
        try {
            await projectService.delete(id);
            loadProjects();
            alert('Proyecto eliminado');
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Error al eliminar proyecto');
        }
    };

    const clearForm = () => {
        setSelectedProject(null);
        setFormData({ name: '', description: '' });
    };

    if (loading) return <div className="loading">Cargando proyectos...</div>;

    return (
        <div className="projects-tab">
            <h2>Gestión de Proyectos</h2>

            <div className="form-section">
                <h3>{selectedProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h3>
                <form onSubmit={handleSubmit} className="project-form">
                    <div className="form-group">
                        <label>Nombre del Proyecto</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            maxLength="100"
                        />
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="3"
                            maxLength="500"
                        />
                    </div>

                    <div className="button-group">
                        <button type="submit" className="btn-primary">
                            {selectedProject ? 'Actualizar' : 'Crear'}
                        </button>
                        {selectedProject && (
                            <button type="button" onClick={clearForm} className="btn-secondary">
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="list-section">
                <h3>Lista de Proyectos</h3>
                <div className="projects-grid">
                    {projects.map(project => (
                        <div key={project._id} className="project-card">
                            <div className="project-header">
                                <h4>{project.name}</h4>
                                <div className="project-actions">
                                    <button onClick={() => handleEdit(project)} className="btn-icon">✏️</button>
                                    <button onClick={() => handleDelete(project._id)} className="btn-icon">🗑️</button>
                                </div>
                            </div>
                            <p>{project.description || 'Sin descripción'}</p>
                            <small>Creado: {new Date(project.createdAt).toLocaleDateString()}</small>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectsTab;
