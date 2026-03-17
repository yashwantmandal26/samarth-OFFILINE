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
            You are a specialized OCR agent for Indian Aadhaar Cards. 
            Analyze the provided image and extract information with 100% accuracy.
            
            Look for:
            1. Name: Usually above the DOB.
            2. DOB: Format is DD/MM/YYYY. Calculate age based on current year 2026.
            3. Gender: Male/Female.
            4. Address: Extract District, State, and PIN code if available on the back side.
            
            Return ONLY a JSON object in this strict format:
            {
                "name": "Full Name",
                "age": 25,
                "gender": "Male/Female",
                "income": 0, 
                "socialCategory": "General",
                "isBPL": false,
                "district": "District Name",
                "state": "State Name",
                "pincode": "6-digit number"
            }
            
            If a value is not found, use these defaults: name: "Citizen", age: 0, gender: "Not specified", district: "Not specified", state: "Jharkhand", pincode: "".
            Do not include any conversational text.
            `;

            const aiResponse = await generateResponse(prompt, {
                model: 'llava',
                images: [base64Image],
                format: 'json'
            });

            // Clean and Parse logic
            let cleanedData = {};
            try {
                if (typeof aiResponse === 'string') {
                    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
                    cleanedData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiResponse);
                } else {
                    cleanedData = aiResponse;
                }
            } catch (e) {
                console.error('[VisionAgent] JSON Parse Error:', e.message);
                throw new Error('Aadhaar data extraction failed. Please ensure the image is clear.');
            }

            // Enhanced Normalization for Aadhaar
            return {
                name: cleanedData.name || 'Citizen',
                age: parseInt(cleanedData.age) || 0,
                gender: (cleanedData.gender || 'Not specified').charAt(0).toUpperCase() + (cleanedData.gender || '').slice(1).toLowerCase(),
                income: parseInt(cleanedData.income) || 0,
                socialCategory: cleanedData.socialCategory || 'General',
                isBPL: !!cleanedData.isBPL,
                district: cleanedData.district || 'Not specified',
                state: cleanedData.state || 'Jharkhand',
                pincode: cleanedData.pincode || '',
                residence: (cleanedData.district && cleanedData.district !== 'Not specified') ? 'Rural' : 'Rural' // Logic can be refined
            };
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
