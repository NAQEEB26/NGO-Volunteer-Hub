import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// Add token to requests if available
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
API.interceptors.response.use(
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

// Auth API calls
export const authAPI = {
    register: (userData) => API.post('/auth/register', userData),
    login: (credentials) => API.post('/auth/login', credentials),
    getMe: () => API.get('/auth/me'),
    updateDetails: (data) => API.put('/auth/updatedetails', data),
    updatePassword: (data) => API.put('/auth/updatepassword', data)
};

// Events API calls
export const eventsAPI = {
    getAll: (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        return API.get(`/events${params ? `?${params}` : ''}`);
    },
    getOne: (id) => API.get(`/events/${id}`),
    create: (eventData) => API.post('/events', eventData),
    update: (id, eventData) => API.put(`/events/${id}`, eventData),
    delete: (id) => API.delete(`/events/${id}`),
    getMyEvents: () => API.get('/events/ngo/myevents')
};

// Registrations API calls
export const registrationsAPI = {
    register: (data) => API.post('/registrations', data),
    getMyRegistrations: () => API.get('/registrations/myregistrations'),
    getEventRegistrations: (eventId) => API.get(`/registrations/event/${eventId}`),
    updateStatus: (id, status) => API.put(`/registrations/${id}`, { status }),
    cancel: (id) => API.delete(`/registrations/${id}`)
};

export default API;
