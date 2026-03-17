const { generateResponse } = require('../services/ollamaService');
const fs = require('fs');
const path = require('path');

const SCHEMES_PATH = path.join(__dirname, '../dataset/jharkhand_schemes.json');

/**
 * Handles natural language queries from users about schemes.
 */
const chatAgent = {
    chat: async (userMessage, userProfile, topSchemes, language = 'en') => {
        // Load full dataset for RAG-like context if topSchemes is empty
        let contextSchemes = topSchemes;
        if (!contextSchemes || contextSchemes.length === 0) {
            try {
                const allSchemes = JSON.parse(fs.readFileSync(SCHEMES_PATH, 'utf8'));
                // Filter some relevant schemes based on simple keyword match in query
                const keywords = userMessage.toLowerCase().split(' ');
                contextSchemes = allSchemes.filter(s => {
                    const nameMatch = s.scheme_name.toLowerCase().includes(userMessage.toLowerCase());
                    const categoryMatch = s.category.toLowerCase().includes(userMessage.toLowerCase());
                    const keywordMatch = Array.isArray(s.keywords) 
                        ? s.keywords.some(kw => keywords.some(k => kw.toLowerCase().includes(k)))
                        : (typeof s.keywords === 'string' && keywords.some(k => s.keywords.toLowerCase().includes(k)));
                    return nameMatch || categoryMatch || keywordMatch;
                }).slice(0, 5);
                
                // If still empty, just take first 3 for basic context
                if (contextSchemes.length === 0) {
                    contextSchemes = allSchemes.slice(0, 3);
                }
            } catch (err) {
                console.error("ChatAgent: Error loading dataset", err);
                contextSchemes = [];
            }
        }

        const schemeContext = contextSchemes.map(s => 
            `- ${s.scheme_name}: ${s.description}. Benefits: ${s.benefits}. Eligibility: ${JSON.stringify(s.eligibility)}`
        ).join('\n');

        let languageInstruction = "";
        if (language === 'hi') {
            languageInstruction = "IMPORTANT: You MUST generate your entire response in pure Hindi script (Devanagari). Do not use English.";
        } else if (language === 'hinglish') {
            languageInstruction = "IMPORTANT: You MUST generate your entire response in Hinglish. Use the Latin/English alphabet, but speak in conversational Hindi (e.g., 'Aap is scheme ke liye eligible hain kyunki...').";
        } else {
            languageInstruction = "Respond in clear, professional English.";
        }

        const prompt = `
        System: You are Samarth, a professional AI assistant for Jharkhand E-Governance.
        User Name: ${userProfile.name || 'Citizen'}
        User Context: ${JSON.stringify(userProfile)}
        
        Knowledge Base (Relevant Schemes):
        ${schemeContext}

        User Query: "${userMessage}"

        Instructions:
        1. Answer based on the Knowledge Base and the user's context.
        2. Be helpful, professional, and empathetic.
        3. If the user asks for eligibility, check the 'Eligibility' section in context.
        4. If you don't know the exact answer, suggest visiting a Pragya Kendra (CSC) or Block Office in Jharkhand.
        5. Respond in a clear, conversational tone.
        6. Keep responses under 100 words unless detail is requested.
        7. ${languageInstruction}
        `;
        
        try {
            return await generateResponse(prompt);
        } catch (error) {
            console.error("ChatAgent: Error generating response", error);
            return "I apologize, but my connection to the AI engine is currently slow. Please ensure Ollama is running Llama3:8b and try again in a moment.";
        }
    }
};

module.exports = chatAgent;
