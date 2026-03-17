/**
 * CoordinatorAgent.js
 * 
 * ROLE: The Agent Management System (AMS) and Directory Facilitator (DF).
 * FUNCTION: Orchestrates inter-agent communication using a FIPA-lite message protocol.
 */

const VisionAgent = require('./VisionAgent');
const EligibilityAgent = require('./EligibilityAgent');
const ExplanationAgent = require('./ExplanationAgent');
const userProfilingAgent = require('./userProfilingAgent');
const fs = require('fs');
const path = require('path');

const SCHEMES_PATH = path.join(__dirname, '../dataset/jharkhand_schemes.json');

const CoordinatorAgent = {
    /**
     * Standard FIPA-lite Message Factory
     */
    createMessage: (sender, receiver, intent, content) => ({
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        sender,
        receiver,
        intent,
        content,
        timestamp: new Date().toISOString()
    }),

    /**
     * Main workflow orchestration (Agent Interaction Protocol)
     */
    requestRecommendations: async (rawUserData, fileBuffer = null, language = 'en') => {
        try {
            console.log(`[CoordinatorAgent] Initiating Recommendation Interaction Protocol (${language})...`);
            let currentProfile = userProfilingAgent.processProfile(rawUserData);
            let messageLog = [];

            // 1. VISION AGENT INTERACTION (If document provided)
            if (fileBuffer) {
                try {
                    const visionMsg = CoordinatorAgent.createMessage(
                        "CoordinatorAgent", 
                        "VisionAgent", 
                        "REQUEST_EXTRACT_ATTRIBUTES", 
                        { buffer: "IMAGE_DATA" }
                    );
                    messageLog.push(visionMsg);

                    const extractedData = await VisionAgent.handleMessage(visionMsg, fileBuffer);
                    console.log("[CoordinatorAgent] Vision Data Extracted:", extractedData);
                    currentProfile = { ...currentProfile, ...extractedData };
                } catch (visionErr) {
                    console.error("[CoordinatorAgent] Vision Stage Failed:", visionErr.message);
                    // Continue with manual data if vision fails
                }
            }

            // 2. ELIGIBILITY AGENT INTERACTION (Symbolic AI)
            let evaluationResult;
            try {
                const rawSchemes = JSON.parse(fs.readFileSync(SCHEMES_PATH, 'utf8'));
                const eligibilityMsg = CoordinatorAgent.createMessage(
                    "CoordinatorAgent",
                    "EligibilityAgent",
                    "REQUEST_SYMBOLIC_EVALUATION",
                    { profile: currentProfile, schemes: rawSchemes }
                );
                messageLog.push(eligibilityMsg);

                evaluationResult = await EligibilityAgent.handleMessage(eligibilityMsg);
            } catch (eligibilityErr) {
                console.error("[CoordinatorAgent] Eligibility Stage Failed:", eligibilityErr.message);
                throw new Error(`Eligibility Engine Error: ${eligibilityErr.message}`);
            }

            // 3. EXPLANATION AGENT INTERACTION (Generative XAI)
            let explainedMatches = [];
            try {
                const top3 = evaluationResult.matches.slice(0, 3);
                explainedMatches = await Promise.all(top3.map(async (match) => {
                    const explanationMsg = CoordinatorAgent.createMessage(
                        "CoordinatorAgent",
                        "ExplanationAgent",
                        "REQUEST_XAI_EXPLANATION",
                        { match, profile: currentProfile, language }
                    );
                    messageLog.push(explanationMsg);
                    
                    try {
                        const explanation = await ExplanationAgent.handleMessage(explanationMsg);
                        return { ...match, aiExplanation: explanation };
                    } catch (e) {
                        console.error(`[CoordinatorAgent] Explanation failed for ${match.scheme_name}:`, e.message);
                        return { ...match, aiExplanation: "Explanation currently unavailable." };
                    }
                }));
            } catch (explanationErr) {
                console.error("[CoordinatorAgent] Explanation Stage Failed:", explanationErr.message);
                // Non-critical, return matches without AI explanations if needed
            }

            // 4. FINAL RESPONSE ASSEMBLY
            return {
                profile: currentProfile,
                recommendations: [
                    ...explainedMatches,
                    ...evaluationResult.matches.slice(3)
                ],
                totalMatches: evaluationResult.matches.length,
                protocolLog: messageLog // Audit trail for research purposes
            };

        } catch (error) {
            console.error('[CoordinatorAgent] Protocol Failure:', error.message);
            throw error;
        }
    }
};

module.exports = CoordinatorAgent;
