/**
 * ExplanationAgent.js
 * 
 * ROLE: The Generative AI / Explainable AI (XAI) Component.
 * FUNCTION: Translates symbolic reasoning paths into human-friendly explanations.
 * 
 * DESIGN PATTERN: Natural Language Generation (NLG) for transparency.
 */

const axios = require('axios');
require('dotenv').config();

const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';

const ExplanationAgent = {
    /**
     * FIPA Message Interface
     */
    handleMessage: async (fipaMessage) => {
        const { intent, content } = fipaMessage;

        switch (intent) {
            case "REQUEST_XAI_EXPLANATION":
                console.log("[ExplanationAgent] Translating Symbolic Path to Natural Language...");
                return await ExplanationAgent.generateExplanation(content.match, content.profile);
            default:
                throw new Error(`[ExplanationAgent] Unknown Intent: ${intent}`);
        }
    },

    /**
     * Generative Reasoning Layer
     * Communicates with local Llama3 via Ollama API.
     */
    generateExplanation: async (match, profile) => {
        const prompt = `
        System: You are an Explainable AI (XAI) agent for Jharkhand E-Governance.
        User Profile: Name: ${profile.name}, Age: ${profile.age}, Occupation: ${profile.occupation}.
        Scheme: ${match.scheme_name}
        Symbolic Reasoning Path (from Expert System): ${match.reasoningPath}
        Benefits: ${match.benefits}

        Instructions:
        1. Act as a professional policy analyst. 
        2. Provide exactly 2-3 crisp, professional bullet points explaining why the citizen is a match based on the provided Symbolic Reasoning Path.
        3. Do NOT include any conversational greetings like "Hello", "Hi", or "Dear citizen".
        4. Do NOT write paragraphs. 
        5. Use the bullet point character "•".
        6. Each bullet should be one sentence maximum.
        7. Base your response STRICTLY on the Symbolic Reasoning Path provided.
        `;

        try {
            const response = await axios.post(OLLAMA_URL, {
                model: 'llama3',
                prompt: prompt,
                stream: false
            }, {
                timeout: 60000 // 60 second timeout
            });
            return response.data.response;
        } catch (error) {
            console.error('[ExplanationAgent] Generation Error:', error.message);
            if (error.code === 'ECONNABORTED') {
                return "• Analysis processing timed out. Please refresh to try again.";
            }
            return "• Ollama server unreachable. Please ensure it is running with 'llama3' model.";
        }
    }
};

module.exports = ExplanationAgent;
