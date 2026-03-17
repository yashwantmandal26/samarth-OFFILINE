/**
 * VisionAgent.js
 * 
 * ROLE: The Multimodal Intake Component.
 * FUNCTION: Document OCR and attribute extraction using LLaVA.
 * 
 * DESIGN PATTERN: Perception Agent / Feature Extraction.
 */

const { generateResponse } = require('../services/ollamaService');
require('dotenv').config();

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

            return await generateResponse(prompt, {
                model: 'llava',
                images: [base64Image],
                format: 'json'
            });
        } catch (error) {
            console.error('[VisionAgent] Extraction Error:', error.message);
            if (error.code === 'ECONNABORTED') {
                throw new Error('Ollama vision processing timed out. Please try again or fill manually.');
            }
            throw new Error('Ollama server unreachable or LLaVA model missing. Please ensure Ollama is running with "llava" model.');
        }
    }
};

module.exports = VisionAgent;
