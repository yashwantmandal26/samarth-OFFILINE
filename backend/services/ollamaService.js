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
            system: options.system || "",
            stream: false,
            ...options
        };

        const response = await axios.post(OLLAMA_URL, payload, {
            timeout: 180000 // 3 minutes timeout for LLaVA/large models
        });
        
        // Return raw response and let agent handle formatting if JSON fails
        if (options.format === 'json') {
            try {
                // Check if Ollama already parsed it
                if (typeof response.data.response === 'object') return response.data.response;
                
                // Try parsing raw string
                return JSON.parse(response.data.response);
            } catch (e) {
                console.warn('[OllamaService] Direct JSON parse failed, returning raw string for agent extraction');
                return response.data.response;
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
