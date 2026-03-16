const axios = require('axios');
require('dotenv').config();

const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';

/**
 * Vision Agent: Uses LLaVA to extract structured data from uploaded documents.
 */
const visionAgent = {
    extractData: async (imageBuffer) => {
        try {
            const base64Image = imageBuffer.toString('base64');
            
            const prompt = `
            Analyze this document (Aadhaar Card, Income Certificate, or Caste Certificate) and extract the following information in strict JSON format:
            {
                "name": "full name",
                "age": number,
                "gender": "Male/Female/Other",
                "income": number (annual),
                "category": "General/SC/ST/OBC",
                "document_type": "type of document detected"
            }
            If a field is not found, use null. Only return the JSON.
            `;

            const response = await axios.post(OLLAMA_URL, {
                model: 'llava', // Using LLaVA for multimodal/OCR
                prompt: prompt,
                images: [base64Image],
                stream: false,
                format: 'json'
            });

            return JSON.parse(response.data.response);
        } catch (error) {
            console.error('Vision Agent Error:', error.message);
            return null;
        }
    }
};

module.exports = visionAgent;
