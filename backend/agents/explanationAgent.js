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
        1. Explain in simple, empathetic terms exactly WHY the citizen qualifies for this scheme.
        2. Base your explanation STRICTLY on the Symbolic Reasoning Path provided.
        3. Eliminate all bureaucratic and mathematical jargon.
        4. Tailor the response to the user's specific socio-economic profile.
        5. Keep it to 3-4 sentences maximum.
        `;

        try {
            const response = await axios.post(OLLAMA_URL, {
                model: 'llama3:8b',
                prompt: prompt,
                stream: false
            });
            return response.data.response;
        } catch (error) {
            console.error('[ExplanationAgent] Generation Error:', error.message);
            return "Based on your profile, you are a strong candidate for this scheme because you meet the eligibility criteria.";
        }
    }
};

module.exports = ExplanationAgent;
