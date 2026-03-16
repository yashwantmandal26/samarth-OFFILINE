const { generateResponse } = require('../services/ollamaService');

/**
 * Uses llama3:8b to generate simplified scheme explanations.
 */
const explanationAgent = {
    explain: async (schemeName, description, benefits, userProfile) => {
        const prompt = `
        System: You are an expert social worker from Jharkhand. Your task is to explain the following government scheme in simple terms to a common citizen.
        User Profile: Name: ${userProfile.name}, Age: ${userProfile.age}, Occupation: ${userProfile.occupation}.
        Scheme: ${schemeName}
        Description: ${description}
        Benefits: ${benefits}
        Instructions: 
        1. Keep it very simple and conversational.
        2. Focus on why it is useful for the person based on their profile.
        3. Explain it in 3-4 sentences maximum.
        `;
        return await generateResponse(prompt);
    }
};

module.exports = explanationAgent;
