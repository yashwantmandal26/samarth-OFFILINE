import axios from 'axios';

// Use 127.0.0.1 directly to avoid localhost resolution issues on Windows
const API_BASE_URL = 'http://127.0.0.1:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 120000, 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor to handle Network Errors more clearly
api.interceptors.response.use(
    response => response,
    error => {
        if (!error.response) {
            console.error('[API] Network Error - Is the backend running?');
            return Promise.reject(new Error('Backend server is unreachable. Please ensure Samarth Backend is running.'));
        }
        return Promise.reject(error);
    }
);

export const schemeService = {
    getAllSchemes: () => api.get('/schemes'),
    getSchemeById: (id) => api.get(`/schemes/${id}`),
    getRecommendations: (userData, language) => {
        // Handle both JSON and FormData (for vision upload)
        if (userData instanceof FormData) {
            userData.append('language', language);
            return api.post('/recommendations', userData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
        return api.post('/recommendations', { ...userData, language });
    },
    chat: (message, userProfile, topSchemes, language, history = []) => 
        api.post('/chat', { message, userProfile, topSchemes, language, history })
};

export default api;
