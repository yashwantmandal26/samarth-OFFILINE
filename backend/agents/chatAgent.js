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
            languageInstruction = "CRITICAL SYSTEM DIRECTIVE: You MUST generate your entire response in pure Hindi script (Devanagari). Do NOT use English characters. Even if the user message is in English, you must reply in Hindi.";
        } else if (language === 'hinglish') {
            languageInstruction = "CRITICAL SYSTEM DIRECTIVE: You MUST generate your entire response in Hinglish. Use the Latin/English alphabet, but speak in conversational Hindi (e.g., 'Aap is scheme ke liye eligible hain kyunki...'). Do NOT use standard English.";
        } else {
            languageInstruction = "Respond in clear, professional English.";
        }

        const systemPrompt = `
        You are Samarth, a professional AI assistant for Jharkhand Scheme Identification.
        ${languageInstruction}
        
        System Context:
        User Name: ${userProfile.name || 'Citizen'}
        User Context: ${JSON.stringify(userProfile)}
        
        Knowledge Base (Relevant Schemes):
        ${schemeContext}

        Core Instructions:
        1. Answer the user's query directly and concisely based on the Knowledge Base and user context.
        2. NO GREETINGS: Do NOT use repetitive greetings like "Namaste, Citizen!" or "I'm here to help you". Jump straight into the information or the answer.
        3. Be professional, accurate, and empathetic.
        4. If the user asks for eligibility, check the 'Eligibility' section in context.
        5. If you don't know the exact answer, suggest visiting a Pragya Kendra (CSC) or Block Office in Jharkhand.
        6. Keep responses under 100 words unless detail is requested.
        7. MANDATORY LANGUAGE COMPLIANCE: ${languageInstruction}
        `;

        const prompt = `User Query: "${userMessage}"`;
        
        try {
            const aiResponse = await generateResponse(prompt, { system: systemPrompt });
            return {
                response: aiResponse,
                relatedSchemes: contextSchemes.map(s => ({
                    id: s.id,
                    scheme_name: s.scheme_name
                }))
            };
        } catch (error) {
            console.error("ChatAgent: Error generating response", error);
            return {
                response: "I apologize, but my connection to the AI engine is currently slow. Please ensure Ollama is running Llama3:8b and try again in a moment.",
                relatedSchemes: []
            };
        }
    }
};

module.exports = chatAgent;
