const axios = require('axios');
require('dotenv').config();

const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
const MODEL = process.env.OLLAMA_MODEL || 'llama3:8b';

const generateResponse = async (prompt) => {
    try {
        const response = await axios.post(OLLAMA_URL, {
            model: MODEL,
            prompt: prompt,
            stream: false
        }, {
            timeout: 60000 // 60 seconds timeout
        });
        return response.data.response;
    } catch (error) {
        console.error('Ollama API Error:', error.message);
        throw error; // Let the caller handle it
    }
};

module.exports = { generateResponse };
