const { generateResponse } = require('../services/ollamaService');
const fs = require('fs');
const path = require('path');
const EligibilityAgent = require('./EligibilityAgent');

// Resolve the absolute path to the dataset folder 
const dbPath = path.join(__dirname, '../dataset/jharkhand_schemes.json'); 

let knowledgeBase = []; 
try { 
    const rawData = fs.readFileSync(dbPath, 'utf8'); 
    knowledgeBase = JSON.parse(rawData); 
    console.log(`[RAG SYSTEM] Successfully loaded ${knowledgeBase.length} schemes from knowledge base.`); 
} catch (error) { 
    console.error(`[CRITICAL ERROR] Failed to load jharkhand_schemes.json at path: ${dbPath}`, error); 
    knowledgeBase = []; 
}

/**
 * Normalizes a string for robust matching
 */
const normalizeString = (str) => {
    if (!str) return "";
    return str.toString().toLowerCase().replace(/[\r\n]+/g, " ").replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
};

/**
 * Entity Extraction: Identifies user attributes from message.
 * This implements the "NLP Understands" part of the philosophy.
 */
const extractEntities = async (message, currentProfile) => {
    const extractionPrompt = `
    Analyze this message: "${message}"
    Update the user profile JSON based ONLY on the message. 
    
    Current Profile: ${JSON.stringify(currentProfile)}
    
    Rules:
    1. Identify AGE (numeric).
    2. Identify INCOME (numeric).
    3. Identify OCCUPATION (e.g., Farmer, Student, Laborer).
    4. Identify DISTRICT (e.g., Dhanbad, Ranchi).
    5. Identify SOCIAL CATEGORY (General, ST, SC, OBC).
    
    Return ONLY the updated JSON object. Do not change existing values unless the message specifically provides new data.
    `;

    try {
        const response = await generateResponse(extractionPrompt, { format: 'json' });
        let updated = {};
        if (typeof response === 'object') {
            updated = response;
        } else {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            updated = jsonMatch ? JSON.parse(jsonMatch[0]) : currentProfile;
        }
        return { ...currentProfile, ...updated };
    } catch (e) {
        console.error("[chatAgent] Extraction Failed:", e.message);
        return currentProfile;
    }
};

/**
 * ChatAgent: Conversational Active Profiling
 */
const chatAgent = {
    chat: async (userMessage, userProfile, topSchemes, language = 'en', history = []) => {
        // 1. NLP UNDERSTANDS: Extract entities from the message
        const newlyExtractedProfile = await extractEntities(userMessage, userProfile);
        
        // 2. IDENTIFY GAPS: Check for Missing Profile Data
        const missingFields = [];
        if (!newlyExtractedProfile.occupation || newlyExtractedProfile.occupation === 'Not specified') missingFields.push('occupation');
        if (!newlyExtractedProfile.age || newlyExtractedProfile.age === 0) missingFields.push('age');
        if (!newlyExtractedProfile.socialCategory || newlyExtractedProfile.socialCategory === 'General') missingFields.push('socialCategory');
        if (!newlyExtractedProfile.income || newlyExtractedProfile.income === 0) missingFields.push('income');
        if (!newlyExtractedProfile.district || newlyExtractedProfile.district === 'Not specified') missingFields.push('district');

        // 3. RULES DECIDE: Perform Internal Eligibility Check if enough data exists
        let eligibilityMatches = [];
        if (missingFields.length <= 1) { // Trigger only if nearly complete
            const evaluation = EligibilityAgent.evaluate(newlyExtractedProfile, knowledgeBase);
            eligibilityMatches = evaluation.matches.slice(0, 3);
        }

        // 4. RAG Retrieval for context (Fallback if no eligibility matches)
        const query = normalizeString(userMessage);
        const queryWords = query.split(' ').filter(w => w.length > 3);
        
        let contextSchemes = eligibilityMatches.length > 0 ? eligibilityMatches : [];
        if (contextSchemes.length === 0) {
            contextSchemes = knowledgeBase.map(s => {
                let score = 0;
                const normName = normalizeString(s.scheme_name);
                const normCategory = normalizeString(s.category);
                const normKeywords = Array.isArray(s.keywords) ? s.keywords.map(k => normalizeString(k)).join(" ") : normalizeString(s.keywords);

                if (normName.includes(query)) score += 20;
                if (normCategory.includes(query)) score += 10;
                queryWords.forEach(word => {
                    if (normName.includes(word)) score += 5;
                    if (normCategory.includes(word)) score += 8;
                });

                if (query.includes("student") && normCategory.includes("pension")) score -= 20;
                return { ...s, r_score: score };
            })
            .filter(s => s.r_score > 0)
            .sort((a, b) => b.r_score - a.r_score)
            .slice(0, 5);
        }

        if (contextSchemes.length === 0) contextSchemes = knowledgeBase.slice(0, 3);

        const schemeContext = contextSchemes.map(s => 
            `- ${s.scheme_name}: ${s.description}. Category: ${s.category}. Benefits: ${s.benefits}. Eligibility: ${JSON.stringify(s.eligibility)}.`
        ).join('\n');

        // 5. AI EXPLAINS: Dynamic Prompting
        let languageInstruction = language === 'hi' ? "Reply ONLY in Devanagari script." : 
                              language === 'hinglish' ? "Reply in Hinglish (Hindi words in English script)." : 
                              "Reply in professional English.";

        const systemPrompt = `
        You are Samarth, a friendly and professional assistant for Jharkhand Government Schemes. 
        ${languageInstruction}

        KNOWLEDGE BASE:
        ${schemeContext}

        USER PROFILE (CURRENT DATA):
        ${JSON.stringify(newlyExtractedProfile)}

        YOUR GOAL:
        Answer user questions about specific schemes using the provided KNOWLEDGE BASE.
        - If the user asks 'Am I eligible?', use their current USER PROFILE to give an honest assessment based on scheme eligibility rules.
        - If they ask about a specific scheme, explain the benefits, documents, and application process clearly from the context.
        - Be direct and helpful. Do not talk about your internal commands or missing fields unless explicitly asked.
        - NO ECHOING: Don't repeat user questions.
        - NO HALLUCINATION: Only use provided knowledge base data.
        `;

        const prompt = `Conversation History:\n${history.map(h => `${h.role}: ${h.content}`).join('\n')}\n\nUser Message: "${userMessage}"`;

        try {
            const aiResponse = await generateResponse(prompt, { system: systemPrompt });
            return {
                response: aiResponse,
                relatedSchemes: contextSchemes.map(s => ({ id: s.id, scheme_name: s.scheme_name })),
                updatedProfile: newlyExtractedProfile 
            };
        } catch (error) {
            console.error("ChatAgent Error:", error);
            return { response: "AI Engine slow. Please try again.", relatedSchemes: [] };
        }
    }
};

module.exports = chatAgent;
