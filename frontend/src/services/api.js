import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const schemeService = {
    getAllSchemes: () => api.get('/schemes'),
    getSchemeById: (id) => api.get(`/schemes/${id}`),
    getRecommendations: (userData) => api.post('/recommendations', userData),
    chat: (message, profile, topSchemes) => api.post('/chat', { message, profile, topSchemes })
};

export default api;
