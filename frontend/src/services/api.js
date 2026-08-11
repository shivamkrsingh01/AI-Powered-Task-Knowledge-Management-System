import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),
};

export const tasksAPI = {
  getTasks: (params = {}) =>
    api.get('/api/tasks', { params }),
  createTask: (task) =>
    api.post('/api/tasks', task),
  updateTask: (id, data) =>
    api.patch(`/api/tasks/${id}`, data),
};

export const documentsAPI = {
  getDocuments: () =>
    api.get('/api/documents'),
  uploadDocument: (formData) =>
    api.post('/api/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

export const searchAPI = {
  search: (query) =>
    api.post('/api/search', { query }),
};

export const analyticsAPI = {
  getAnalytics: () =>
    api.get('/api/analytics'),
};

export default api;
