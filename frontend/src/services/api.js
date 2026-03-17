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
