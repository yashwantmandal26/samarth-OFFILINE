/**
 * ExplanationAgent.js
 * 
 * ROLE: The Generative AI / Explainable AI (XAI) Component.
 * FUNCTION: Translates symbolic reasoning paths into human-friendly explanations.
 * 
 * DESIGN PATTERN: Natural Language Generation (NLG) for transparency.
 */

const { generateResponse } = require('../services/ollamaService');
require('dotenv').config();

const ExplanationAgent = {
    /**
     * FIPA Message Interface
     */
    handleMessage: async (fipaMessage) => {
        const { intent, content } = fipaMessage;

        switch (intent) {
            case "REQUEST_XAI_EXPLANATION":
                console.log(`[ExplanationAgent] Translating Symbolic Path to Natural Language (${content.language})...`);
                return await ExplanationAgent.generateExplanation(content.match, content.profile, content.language);
            default:
                throw new Error(`[ExplanationAgent] Unknown Intent: ${intent}`);
        }
    },

    /**
     * Generative Reasoning Layer
     * Communicates with local Llama3 via Ollama API.
     */
    generateExplanation: async (match, profile, language = 'en') => {
        let languageInstruction = "";
        if (language === 'hi') {
            languageInstruction = "CRITICAL: Reply ONLY in professional Hindi (Devanagari). Use sophisticated administrative vocabulary.";
        } else if (language === 'hinglish') {
            languageInstruction = "CRITICAL: Reply in Hinglish. Use professional tone, avoid casual slang.";
        } else {
            languageInstruction = "Respond in highly professional, authoritative English.";
        }

        const systemPrompt = `
        You are a Senior Policy Consultant for the Government of Jharkhand.
        ${languageInstruction}

        CONTEXT:
        Citizen: ${profile.name} (Age: ${profile.age}, Occupation: ${profile.occupation})
        Target Scheme: ${match.scheme_name}
        Eligibility Verification Path: ${match.reasoningPath}
        Match Confidence: ${match.matchScore}%

        TASK:
        Generate a sophisticated, high-level reasoning summary explaining why this citizen is a high-probability match for this specific policy.

        STRICT GUIDELINES:
        1. AUTHORITATIVE VOICE: Speak like an expert analyst, not a chatbot. Use phrases like "Aligned with strategic objectives," "Meets prescribed socio-economic criteria," or "Directly qualified via..."
        2. NO TECHNICAL TAGS: You are FORBIDDEN from using backend tags like "RULE_AGE_VALID" or "RULE_CATEGORY_MATCH". Translate these into natural human sentences.
        3. FORMAT: Exactly 3 professional bullet points using "✦" as the character.
        4. BREVITY: Each point must be concise but information-dense.
        5. NO GREETINGS: Do not say "Based on your profile" or "Hello". Start immediately with the analysis.
        6. LANGUAGE COMPLIANCE: ${languageInstruction}
        `;

        const prompt = "Execute policy alignment analysis.";

        try {
            const response = await generateResponse(prompt, { system: systemPrompt });
            // Final cleanup: remove any lingering technical artifacts
            return response.replace(/RULE_[A-Z_]+/g, '').trim();
        } catch (error) {
            console.error('[ExplanationAgent] Generation Error:', error.message);
            if (error.code === 'ECONNREFUSED') {
                return "• Connection refused. Please ensure Ollama is running at 127.0.0.1:11434.";
            }
            if (error.code === 'ECONNABORTED') {
                return "• Analysis processing timed out. Please refresh to try again.";
            }
            return "• Ollama server unreachable. Please ensure it is running with 'llama3:8b' model.";
        }
    }
};

module.exports = ExplanationAgent;
