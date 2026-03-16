const userProfilingAgent = require('./userProfilingAgent');
const schemeMatchingAgent = require('./schemeMatchingAgent');
const explanationAgent = require('./explanationAgent');
const chatAgent = require('./chatAgent');
const fs = require('fs');
const path = require('path');

const SCHEMES_PATH = path.join(__dirname, '../dataset/jharkhand_schemes.json');

/**
 * Orchestrates interaction between all agents.
 */
const orchestrator = {
    getRecommendations: async (rawUserData) => {
        try {
            // 1. Profiling
            const profile = userProfilingAgent.processProfile(rawUserData);

            // 2. Load Schemes
            const rawSchemes = JSON.parse(fs.readFileSync(SCHEMES_PATH, 'utf8'));

            // 3. Matching
            const recommendedSchemes = schemeMatchingAgent.calculateMatch(profile, rawSchemes);

            // 4. Explanation for Top Recommended
            // (Only for top 3 to keep performance high)
            const top3 = recommendedSchemes.slice(0, 3);
            const explainedTop3 = await Promise.all(top3.map(async (scheme) => {
                const aiExplanation = await explanationAgent.explain(
                    scheme.scheme_name, 
                    scheme.description, 
                    scheme.benefits, 
                    profile
                );
                return { ...scheme, aiExplanation };
            }));

            // Reconstruct full list with explanations for top 3
            const fullResult = [
                ...explainedTop3,
                ...recommendedSchemes.slice(3)
            ];

            return {
                profile,
                recommendations: fullResult,
                totalMatches: recommendedSchemes.length
            };
        } catch (error) {
            console.error('Orchestrator Error:', error);
            throw error;
        }
    },

    handleChat: async (userMessage, userProfile, topSchemes) => {
        return await chatAgent.chat(userMessage, userProfile, topSchemes);
    }
};

module.exports = orchestrator;
