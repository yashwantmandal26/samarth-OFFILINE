const { generateResponse } = require('../services/ollamaService');

/**
 * Handles natural language queries from users about schemes.
 */
const chatAgent = {
    chat: async (userMessage, userProfile, topSchemes) => {
        const top3Names = topSchemes.slice(0, 3).map(s => s.scheme_name).join(', ');
        const prompt = `
        System: You are Samarth, an AI assistant for Jharkhand government schemes. 
        User Name: ${userProfile.name}
        User Context: Age: ${userProfile.age}, Occupation: ${userProfile.occupation}, Category: ${userProfile.socialCategory}.
        Top Recommended Schemes: ${top3Names}
        User Query: "${userMessage}"
        Instructions:
        1. Answer based on Jharkhand government schemes and the user's context.
        2. Be helpful, professional, and empathetic.
        3. If the user asks for more schemes, mention the ones listed in the recommended section.
        4. If you don't know the exact answer, suggest contacting the local Block Office or Pragya Kendra.
        5. Keep responses concise and informative.
        `;
        return await generateResponse(prompt);
    }
};

module.exports = chatAgent;
