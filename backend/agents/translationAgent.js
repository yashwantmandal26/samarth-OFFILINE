const axios = require('axios');
require('dotenv').config();

const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';

/**
 * Translation Agent: Translates/Simplifies bureaucratic jargon into accessible Hindi/English.
 */
const translationAgent = {
    simplifyAndTranslate: async (schemeName, reasoningChain, benefits, userProfile) => {
        try {
            const prompt = `
            You are a social worker from Jharkhand. Your task is to explain why ${userProfile.name} is eligible for the "${schemeName}" scheme.
            
            Technical Reasoning: ${reasoningChain}
            Benefits: ${benefits}
            
            Instructions:
            1. Simplify the reasoning into easy-to-understand conversational language.
            2. Remove all complex legal or bureaucratic jargon.
            3. Mention the key benefit clearly.
            4. If possible, provide a dual-language (Hindi + English) explanation that is very short (3-4 sentences).
            5. Tailor it to the user's background (Occupation: ${userProfile.occupation}).
            `;

            const response = await axios.post(OLLAMA_URL, {
                model: 'llama3:8b',
                prompt: prompt,
                stream: false
            });

            return response.data.response;
        } catch (error) {
            console.error('Translation Agent Error:', error.message);
            return "Unable to generate simplified explanation at this time.";
        }
    }
};

module.exports = translationAgent;
