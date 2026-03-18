const { generateResponse } = require('../services/ollamaService');
const fs = require('fs');
const path = require('path');

// Resolve the absolute path to the dataset folder 
const dbPath = path.join(__dirname, '../dataset/jharkhand_schemes.json'); 

let knowledgeBase = []; 
try { 
    const rawData = fs.readFileSync(dbPath, 'utf8'); 
    knowledgeBase = JSON.parse(rawData); 
    console.log(`[RAG SYSTEM] Successfully loaded ${knowledgeBase.length} schemes from knowledge base.`); 
} catch (error) { 
    console.error(`[CRITICAL ERROR] Failed to load jharkhand_schemes.json at path: ${dbPath}`, error); 
    // Fallback to empty array to prevent total crash 
    knowledgeBase = []; 
}

/**
 * Normalizes a string for robust matching:
 * - Lowercase
 * - Newlines to spaces
 * - Remove special characters/punctuation
 * - Single spaces only
 * - Trim
 */
const normalizeString = (str) => {
    if (!str) return "";
    return str
        .toString()
        .toLowerCase()
        .replace(/[\r\n]+/g, " ")
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
};

/**
 * Handles natural language queries from users about schemes and the Samarth project itself.
 */
const chatAgent = {
    chat: async (userMessage, userProfile, topSchemes, language = 'en', history = []) => {
        // 1. Static Project Knowledge Base (Internal RAG)
        const projectKnowledge = {
            name: "Samarth",
            description: "A Hybrid Symbolic-Generative Multi-Agent System for Jharkhand E-Governance.",
            developer: "Yashwant Mandal (MCA Dissertation - VIT Vellore)",
            architecture: "Hybrid Symbolic-Generative (FIPA-lite Protocol)",
            agents: [
                { name: "Coordinator Agent", role: "Agent Management System (AMS) / Orchestrator" },
                { name: "Vision Agent", role: "Multimodal OCR (Aadhaar/Certificate scanning) using LLaVA" },
                { name: "Eligibility Agent", role: "Deterministic rule matching using Symbolic AI" },
                { name: "Explanation Agent", role: "Generative Explainable AI (XAI) for policy reasoning" },
                { name: "Chat Agent", role: "RAG-based conversational assistant" }
            ],
            techStack: "Node.js, React, Tailwind, Ollama (Llama3, LLaVA)",
            features: "Offline-first privacy, voice-enabled STT/TTS, smart document intake."
        };

        // 2. Enhanced Scheme Retrieval (Scoring Logic)
        let contextSchemes = topSchemes;
        if (!contextSchemes || contextSchemes.length === 0) {
            const query = normalizeString(userMessage);
            const historyText = normalizeString(history.slice(-2).map(h => h.content).join(' '));
            
            // Scoring system for better RAG
            contextSchemes = knowledgeBase.map(s => {
                let score = 0;
                const normName = normalizeString(s.scheme_name);
                const normCategory = normalizeString(s.category);
                const normKeywords = Array.isArray(s.keywords) 
                    ? s.keywords.map(k => normalizeString(k)).join(" ") 
                    : normalizeString(s.keywords);

                if (normName.includes(query)) score += 10;
                if (normCategory.includes(query)) score += 5;
                if (normKeywords.includes(query)) score += 3;
                
                // Contextual score from history
                if (historyText) {
                    if (normName.split(' ').some(word => word.length > 3 && historyText.includes(word))) score += 4;
                    if (normCategory.split(' ').some(word => word.length > 3 && historyText.includes(word))) score += 2;
                }
                
                return { ...s, r_score: score };
            })
            .filter(s => s.r_score > 0)
            .sort((a, b) => b.r_score - a.r_score)
            .slice(0, 5);
            
            if (contextSchemes.length === 0) {
                contextSchemes = knowledgeBase.slice(0, 3);
            }
        }

        const schemeContext = contextSchemes.map(s => 
            `- ${s.scheme_name}: ${s.description}. Benefits: ${s.benefits}. Eligibility: ${JSON.stringify(s.eligibility)}. Application Process: ${s.application_process}. Documents Needed: ${s.documents_required?.join(', ')}`
        ).join('\n');

        // 3. Prompt Engineering
        let languageInstruction = "";
        if (language === 'hi') {
            languageInstruction = "CRITICAL: Reply ONLY in pure Hindi script (Devanagari).";
        } else if (language === 'hinglish') {
            languageInstruction = "CRITICAL: Reply in Hinglish (Hindi words in English script).";
        } else {
            languageInstruction = "Reply in professional English.";
        }

        const conversationHistory = history.map(h => `${h.role === 'user' ? 'User' : 'Samarth'}: ${h.content}`).join('\n');

        const systemPrompt = `
        You are Samarth, the intelligent assistant for the Samarth Project.
        ${languageInstruction}
        
        KNOWLEDGE BASE (Jharkhand Schemes):
        ${schemeContext}

        PROJECT KNOWLEDGE (Internal):
        - Description: ${projectKnowledge.description}
        - Architecture: ${projectKnowledge.architecture}
        - Agents: ${projectKnowledge.agents.map(a => `${a.name} (${a.role})`).join(', ')}

        CORE DIRECTIVES (STRICT):
        1. CONTEXT STICKINESS: If the user asks "how to get it", "what to do", or "is it for X", you MUST refer to the Application Process, Documents, or Eligibility of the scheme discussed in the IMMEDIATE PREVIOUS message.
        2. NO HALLUCINATION: Only talk about schemes listed in the KNOWLEDGE BASE above. Do NOT mention schemes like PMJDY or others if they are not in the list.
        3. NO REPETITION: Do NOT repeat the user's question or use "Citizen" as a prefix.
        4. DIRECT ANSWER: If asked "what to do", list the Application Process steps directly from the context.
        5. LANGUAGE: ${languageInstruction}
        `;

        const prompt = `History:\n${conversationHistory}\n\nQuery: "${userMessage}"`;
        
        try {
            const aiResponse = await generateResponse(prompt, { system: systemPrompt });
            return {
                response: aiResponse,
                relatedSchemes: contextSchemes.map(s => ({ id: s.id, scheme_name: s.scheme_name }))
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
