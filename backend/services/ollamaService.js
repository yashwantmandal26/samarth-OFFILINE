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
        });
        return response.data.response;
    } catch (error) {
        console.error('Ollama API Error:', error.message);
        return "I'm sorry, I'm having trouble connecting to the AI model right now. Please ensure Ollama is running locally with llama3:8b.";
    }
};

module.exports = { generateResponse };
