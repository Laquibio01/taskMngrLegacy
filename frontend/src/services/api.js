import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get('/auth/users');
    return response.data;
  },
};

export const taskService = {
  getAll: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  create: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  update: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
  search: async (filters) => {
    const response = await api.get('/tasks/search', { params: filters });
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/tasks/stats');
    return response.data;
  },
};

export const projectService = {
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
  create: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },
  update: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

export const commentService = {
  getByTask: async (taskId) => {
    const response = await api.get(`/comments/task/${taskId}`);
    return response.data;
  },
  create: async (commentData) => {
    const response = await api.post('/comments', commentData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },
};

export const historyService = {
  getByTask: async (taskId) => {
    const response = await api.get(`/history/task/${taskId}`);
    return response.data;
  },
  getAll: async (limit = 100) => {
    const response = await api.get('/history', { params: { limit } });
    return response.data;
  },
};

export const notificationService = {
  getAll: async (read = null) => {
    const params = read !== null ? { read } : {};
    const response = await api.get('/notifications', { params });
    return response.data;
  },
  markAsRead: async () => {
    const response = await api.put('/notifications/mark-read');
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};

export const reportService = {
  getTasksReport: async () => {
    const response = await api.get('/reports/tasks');
    return response.data;
  },
  getProjectsReport: async () => {
    const response = await api.get('/reports/projects');
    return response.data;
  },
  getUsersReport: async () => {
    const response = await api.get('/reports/users');
    return response.data;
  },
  exportCSV: async () => {
    const response = await api.get('/reports/export/csv', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'export_tasks.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};

export default api;
