import React, { useState, useEffect } from 'react';
import { commentService, taskService } from '../../services/api';
import './CommentsTab.css';

const CommentsTab = () => {
  const [taskId, setTaskId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
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

  const handleLoadComments = async () => {
    if (!taskId) {
      alert('Seleccione una tarea');
      return;
    }

    setLoading(true);
    try {
      const data = await commentService.getByTask(taskId);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
      alert('Error al cargar los comentarios');
    } finally {
      setLoading(false);
    }
  };

  // Auto-load comments when task is selected
  useEffect(() => {
    if (taskId) {
      handleLoadComments();
    }
  }, [taskId]);

  const handleAddComment = async () => {
    if (!taskId) {
      alert('Seleccione una tarea');
      return;
    }

    if (!commentText.trim()) {
      alert('El comentario no puede estar vacío');
      return;
    }

    try {
      await commentService.create({
        taskId,
        commentText
      });
      setCommentText('');
      handleLoadComments();
      alert('Comentario agregado');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error al agregar el comentario');
    }
  };

  return (
    <div className="comments-tab">
      <h2>Comentarios de Tareas</h2>

      <div className="form-section">
        <div className="form-group">
          <label>Tarea:</label>
          <select
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            className="task-select"
          >
            <option value="">-- Seleccionar Tarea --</option>
            {tasks.map(task => (
              <option key={task._id} value={task._id}>
                {task.title}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Comentario:</label>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows="3"
            placeholder="Escribe tu comentario aquí"
          />
        </div>
        <div className="button-group">
          <button onClick={handleAddComment} className="btn-primary">Agregar Comentario</button>
        </div>
      </div>

      <div className="comments-section">
        <h3>Comentarios</h3>
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : !taskId ? (
          <div className="empty-state">Seleccione una tarea para ver sus comentarios</div>
        ) : comments.length === 0 ? (
          <div className="empty-state">No hay comentarios para esta tarea</div>
        ) : (
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment._id} className="comment-item">
                <div className="comment-header">
                  <strong>{comment.userId?.username || 'Usuario'}</strong>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="comment-text">{comment.commentText}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsTab;
