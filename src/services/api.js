import axios from 'axios';
import { store } from '../store/store.js';
import router from '../router/index.js';

const TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    store.isAuthenticated = false;  // Actualizar el estado de autenticación en el store
    store.user = null;  // Limpiar el usuario en el store
};

export const apiClient = axios.create({
    baseURL: process.env.API_URL || 'http://localhost:8000/api',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

// Interceptor para incluir el token en las peticiones
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor para manejar errores de respuesta y refrescar el token si es necesario
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Manejo de error 401 - Token expirado
        if (error.response && error.response.status === 401) {
            if (!originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
                    if (!refreshToken) {
                        // No hay refresh token, mostrar notificación y redirigir
                        store.showNotification('Session expired. Please log in again.', 'error');
                        removeToken();
                        router.push('/login');
                        return Promise.reject(error);
                    }

                    // Intentar refrescar el token
                    const response = await apiClient.post('/token/refresh/', { refresh: refreshToken });
                    const { access } = response.data;
                    localStorage.setItem(TOKEN_KEY, access);
                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    return apiClient(originalRequest);
                } catch (err) {
                    console.error('Token refresh failed', err);
                    // Mostrar notificación y redirigir en caso de fallo al refrescar el token
                    store.showNotification('Session expired. Please log in again.', 'error');
                    removeToken();
                    router.push('/login');
                    return Promise.reject(err);
                }
            }
        }

        // Manejo de otros errores
        if (error.response) {
            store.showNotification(`Error: ${error.response.statusText}`, 'error');
        } else {
            store.showNotification('Network Error', 'error');
        }

        return Promise.reject(error);
    }
);


export default {
    // Tasks API
    getTasks() {
        return apiClient.get('/tasks/');
    },
    getTaskById(id) {
        return apiClient.get(`/tasks/${id}/`);
    },
    createTask(task) {
        return apiClient.post('/tasks/', task);
    },
    updateTask(id, task) {
        return apiClient.put(`/tasks/${id}/`, task);
    },
    deleteTask(id) {
        return apiClient.delete(`/tasks/${id}/`);
    },

    // Categories API
    getCategories() {
        return apiClient.get('/categories/');
    },
    getCategoryById(id) {
        return apiClient.get(`/categories/${id}/`);
    },
    createCategory(category) {
        return apiClient.post('/categories/', category);
    },
    updateCategory(id, category) {
        return apiClient.put(`/categories/${id}/`, category);
    },
    deleteCategory(id) {
        return apiClient.delete(`/categories/${id}/`);
    },

    // Tags API
    getTags() {
        return apiClient.get('/tags/');
    },
    getTagById(id) {
        return apiClient.get(`/tags/${id}/`);
    },
    createTag(tag) {
        return apiClient.post('/tags/', tag);
    },
    updateTag(id, tag) {
        return apiClient.put(`/tags/${id}/`, tag);
    },
    deleteTag(id) {
        return apiClient.delete(`/tags/${id}/`);
    },

    // Users API
    getUsers() {
        return apiClient.get('/users/');
    },
    getUserById(id) {
        return apiClient.get(`/users/${id}/`);
    },
    createUser(user) {
        return apiClient.post('/users/', user);
    },
    updateUser(id, user) {
        return apiClient.put(`/users/${id}/`, user);
    },
    deleteUser(id) {
        return apiClient.delete(`/users/${id}/`);
    },

    // Authentication
    login(credentials) {
        return apiClient.post('/token/', credentials);
    },
    refreshToken(refreshToken) {
        return apiClient.post('/token/refresh/', { refresh: refreshToken });
    }
};

