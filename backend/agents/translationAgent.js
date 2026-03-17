const { generateResponse } = require('../services/ollamaService');
require('dotenv').config();

const translationAgent = {
    simplify: async (complexExplanation, userProfile) => {
        const prompt = `
        System: You are a simplified policy translator for Jharkhand citizens.
        Goal: Convert bureaucratic language into plain, empathetic speech.
        
        Complex Explanation:
        "${complexExplanation}"
        
        Instructions:
        1. Simplify the reasoning into easy-to-understand conversational language.
        2. Remove all complex legal or bureaucratic jargon.
        3. Mention the key benefit clearly.
        4. If possible, provide a dual-language (Hindi + English) explanation that is very short (3-4 sentences).
        5. Tailor it to the user's background (Occupation: ${userProfile.occupation}).
        6. You can use Markdown for formatting (e.g. **bold** for key terms).
        `;

        try {
            return await generateResponse(prompt);
        } catch (error) {
            console.error('Translation Agent Error:', error.message);
            if (error.code === 'ECONNREFUSED') {
                return "Unable to connect to translation engine. Please ensure Ollama is running at 127.0.0.1.";
            }
            return "Unable to generate simplified explanation at this time.";
        }
    }
};

module.exports = translationAgent;
