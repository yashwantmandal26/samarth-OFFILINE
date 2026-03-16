const userProfilingAgent = require('./userProfilingAgent');
const visionAgent = require('./visionAgent');
const reasoningAgent = require('./reasoningAgent');
const translationAgent = require('./translationAgent');
const fs = require('fs');
const path = require('path');

const SCHEMES_PATH = path.join(__dirname, '../dataset/jharkhand_schemes.json');

/**
 * Orchestrates the Multimodal Multi-Agent flow.
 */
const orchestrator = {
    getRecommendations: async (rawUserData, fileBuffer = null) => {
        try {
            let extractedProfile = {};
            let agentStatus = [];

            // 1. Vision Agent (If file provided)
            if (fileBuffer) {
                agentStatus.push({ agent: 'Vision Agent', status: 'Reading document...' });
                const visionData = await visionAgent.extractData(fileBuffer);
                if (visionData) {
                    extractedProfile = visionData;
                    agentStatus.push({ agent: 'Vision Agent', status: 'Data extracted successfully.' });
                }
            }

            // 2. Profiling Agent (Merge manual + vision data)
            const manualProfile = userProfilingAgent.processProfile(rawUserData);
            const finalProfile = { ...manualProfile, ...extractedProfile };

            // 3. Reasoning Agent (RAG-based matching)
            agentStatus.push({ agent: 'Reasoning Agent', status: 'Evaluating eligibility via policy reasoning...' });
            const rawSchemes = JSON.parse(fs.readFileSync(SCHEMES_PATH, 'utf8'));
            const matches = await reasoningAgent.evaluateEligibility(finalProfile, rawSchemes);

            // 4. Translation Agent (Simplification)
            agentStatus.push({ agent: 'Translation Agent', status: 'Simplifying output for accessibility...' });
            const top3 = matches.slice(0, 3);
            const processedTop3 = await Promise.all(top3.map(async (scheme) => {
                const vernacularExplanation = await translationAgent.simplifyAndTranslate(
                    scheme.scheme_name,
                    scheme.reasoningChain,
                    scheme.benefits,
                    finalProfile
                );
                return { ...scheme, aiExplanation: vernacularExplanation };
            }));

            const finalResults = [
                ...processedTop3,
                ...matches.slice(3)
            ];

            return {
                profile: finalProfile,
                recommendations: finalResults,
                totalMatches: matches.length,
                agentWorkflow: agentStatus
            };

        } catch (error) {
            console.error('Orchestrator Error:', error);
            throw error;
        }
    }
};

module.exports = orchestrator;
