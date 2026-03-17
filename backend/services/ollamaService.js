const axios = require('axios');
require('dotenv').config();

const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://127.0.0.1:11434/api/generate';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'llama3:8b';

const generateResponse = async (prompt, options = {}) => {
    try {
        const model = options.model || DEFAULT_MODEL;
        console.log(`[OllamaService] Sending prompt to ${OLLAMA_URL} using model: ${model}...`);
        
        const payload = {
            model: model,
            prompt: prompt,
            stream: false,
            ...options
        };

        const response = await axios.post(OLLAMA_URL, payload, {
            timeout: 90000 // 90 seconds timeout for larger models
        });
        
        // Handle both raw string and JSON responses
        if (options.format === 'json') {
            try {
                return typeof response.data.response === 'string' 
                    ? JSON.parse(response.data.response) 
                    : response.data.response;
            } catch (e) {
                console.error('[OllamaService] JSON Parse Error:', e.message);
                throw new Error('Failed to parse AI JSON response');
            }
        }
        
        return response.data.response;
    } catch (error) {
        console.error('[OllamaService] API Error:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('[OllamaService] Connection refused. Is Ollama running with OLLAMA_ORIGINS="*"?');
        }
        throw error; 
    }
};

module.exports = { generateResponse };
