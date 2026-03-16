/**
 * VisionAgent.js
 * 
 * ROLE: The Multimodal Intake Component.
 * FUNCTION: Document OCR and attribute extraction using LLaVA.
 * 
 * DESIGN PATTERN: Perception Agent / Feature Extraction.
 */

const axios = require('axios');
require('dotenv').config();

const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';

const VisionAgent = {
    /**
     * FIPA Message Interface
     */
    handleMessage: async (fipaMessage, fileBuffer) => {
        const { intent } = fipaMessage;

        switch (intent) {
            case "REQUEST_EXTRACT_ATTRIBUTES":
                console.log("[VisionAgent] Processing Multimodal Input (LLaVA)...");
                return await VisionAgent.extract(fileBuffer);
            default:
                throw new Error(`[VisionAgent] Unknown Intent: ${intent}`);
        }
    },

    /**
     * Multimodal Feature Extraction
     * Communicates with local LLaVA via Ollama API.
     */
    extract: async (imageBuffer) => {
        try {
            const base64Image = imageBuffer.toString('base64');
            
            const prompt = `
            Perform OCR and analyze this Jharkhand government document (Aadhaar, Income, or Caste Certificate).
            Extract these attributes in strict JSON format:
            {
                "name": "string",
                "age": number,
                "gender": "Male/Female/Other",
                "income": number,
                "socialCategory": "General/SC/ST/OBC",
                "isBPL": boolean
            }
            Only return the JSON object.
            `;

            const response = await axios.post(OLLAMA_URL, {
                model: 'llava',
                prompt: prompt,
                images: [base64Image],
                stream: false,
                format: 'json'
            });

            return JSON.parse(response.data.response);
        } catch (error) {
            console.error('[VisionAgent] Extraction Error:', error.message);
            return {};
        }
    }
};

module.exports = VisionAgent;
