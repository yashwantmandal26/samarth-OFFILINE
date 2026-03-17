/**
 * VisionAgent.js
 * 
 * ROLE: The Multimodal Intake Component.
 * FUNCTION: Document OCR and attribute extraction using LLaVA.
 * 
 * DESIGN PATTERN: Perception Agent / Feature Extraction.
 */

const { generateResponse } = require('../services/ollamaService');
const Tesseract = require('tesseract.js');
require('dotenv').config();

const VisionAgent = {
    /**
     * FIPA Message Interface
     */
    handleMessage: async (fipaMessage, fileBuffer) => {
        const { intent } = fipaMessage;

        switch (intent) {
            case "REQUEST_EXTRACT_ATTRIBUTES":
                console.log("[VisionAgent] Processing Document with Native Tesseract Engine...");
                return await VisionAgent.extract(fileBuffer);
            default:
                throw new Error(`[VisionAgent] Unknown Intent: ${intent}`);
        }
    },

    /**
     * Stable OCR Extraction (Native Tesseract.js)
     * No Python/Paddle dependencies required.
     */
    extract: async (imageBuffer) => {
        try {
            console.log(`[VisionAgent] Step 1: Extracting text with Tesseract.js...`);
            
            const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng+hin', {
                // Config to prioritize clean text over speed
                tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz/ -.,:()',
            });

            console.log("[VisionAgent] Raw Text Captured:", text?.substring(0, 100));

            if (!text || text.trim().length < 10) {
                console.warn("[VisionAgent] Text too short. Skipping AI parsing.");
                return { name: 'Citizen', age: 0 };
            }

            console.log("[VisionAgent] Step 2: Semantic Parsing with Llama3...");
            
            const parsingPrompt = `
            Extracted text from an Indian Aadhaar Card (front and back):
            """
            ${text}
            """

            CRITICAL TASK: Extract the MAIN HOLDER'S details with 100% precision.
            
            Strict Name Rules:
            1. The User's Name is ONLY found on the FRONT side, usually above or near the DOB.
            2. NEVER use names associated with "C/O", "S/O", "D/O", or "W/O" as the User Name. These are relative names found on the BACK side.
            3. If you see "Shyam Kumar Saw" after "C/O", it is the FATHER/RELATIVE name. IGNORE it for the 'name' field.
            4. Identify the name that appears independently (e.g., "Srishti Saw").

            Other Rules:
            - DOB/AGE: Use "DOB: DD/MM/YYYY" to calculate age in 2026.
            - GENDER: Standardize to "Male" or "Female".
            - DISTRICT: Identify the Jharkhand district from the address.
            
            Required JSON Format:
            {
                "name": "Main Holder Full Name (MUST NOT BE RELATIVE)",
                "age": 25,
                "gender": "Male/Female",
                "district": "District Name"
            }
            Return ONLY the JSON object.
            `;

            let aiResponse;
            try {
                aiResponse = await generateResponse(parsingPrompt, {
                    model: 'llama3:8b',
                    format: 'json'
                });
            } catch (llamaErr) {
                console.error("[VisionAgent] Llama3 Parsing Failed. Returning defaults.");
                return { name: 'Citizen', age: 0 };
            }

            let cleanedData = {};
            try {
                if (typeof aiResponse === 'object') {
                    cleanedData = aiResponse;
                } else {
                    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
                    cleanedData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiResponse);
                }
            } catch (e) {
                cleanedData = { name: 'Citizen', age: 0 };
            }

            return {
                name: cleanedData.name || 'Citizen',
                age: parseInt(cleanedData.age) || 0,
                gender: cleanedData.gender || 'Not specified',
                income: 0,
                socialCategory: 'General',
                isBPL: false,
                district: cleanedData.district || 'Not specified'
            };
        } catch (error) {
            console.error('[VisionAgent] Native OCR Error:', error.message);
            // DO NOT THROW. Return fallback to allow manual fill.
            return { name: 'Citizen', age: 0, error: 'OCR failed. Please fill manually.' };
        }
    }
};

module.exports = VisionAgent;
