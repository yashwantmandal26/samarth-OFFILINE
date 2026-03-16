const axios = require('axios');
require('dotenv').config();

const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://127.0.0.1:11434/api/generate';
const MODEL = process.env.OLLAMA_MODEL || 'llama3';

const generateResponse = async (prompt) => {
    try {
        console.log(`[OllamaService] Sending prompt to ${OLLAMA_URL}...`);
        const response = await axios.post(OLLAMA_URL, {
            model: MODEL,
            prompt: prompt,
            stream: false
        }, {
            timeout: 60000 // 60 seconds timeout
        });
        return response.data.response;
    } catch (error) {
        console.error('[OllamaService] API Error:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('[OllamaService] Connection refused. Is Ollama running with OLLAMA_ORIGINS="*"?');
        }
        throw error; // Let the caller handle it
    }
};

module.exports = { generateResponse };
