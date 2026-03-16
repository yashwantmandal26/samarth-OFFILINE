/**
 * SimulationAgent.js
 * 
 * ROLE: The Policy Impact Simulator.
 * FUNCTION: Evaluates "What-If" scenarios to predict changes in scheme eligibility.
 * 
 * DESIGN PATTERN: Predictive Analytics Agent / Sensitivity Analysis.
 */

const EligibilityAgent = require('./EligibilityAgent');
const fs = require('fs');
const path = require('path');

const SCHEMES_PATH = path.join(__dirname, '../dataset/jharkhand_schemes.json');

const SimulationAgent = {
    /**
     * FIPA Message Interface
     */
    handleMessage: async (fipaMessage) => {
        const { intent, content } = fipaMessage;

        switch (intent) {
            case "REQUEST_SIMULATION_DELTA":
                console.log("[SimulationAgent] Analyzing Policy Sensitivity...");
                return await SimulationAgent.runSimulation(content.profile, content.hypotheticalChanges);
            default:
                throw new Error(`[SimulationAgent] Unknown Intent: ${intent}`);
        }
    },

    /**
     * Sensitivity Analysis Logic
     * Computes the difference (delta) between original and hypothetical states.
     */
    runSimulation: async (originalProfile, hypotheticalChanges) => {
        const rawSchemes = JSON.parse(fs.readFileSync(SCHEMES_PATH, 'utf8'));
        
        // 1. Get Original Results
        const originalResult = EligibilityAgent.evaluate(originalProfile, rawSchemes);
        
        // 2. Create Hypothetical Profile
        const hypotheticalProfile = { ...originalProfile, ...hypotheticalChanges };
        
        // 3. Get Hypothetical Results
        const hypotheticalResult = EligibilityAgent.evaluate(hypotheticalProfile, rawSchemes);

        // 4. Calculate Impact Delta
        const impactDelta = hypotheticalResult.matches.map(hypoScheme => {
            const originalScheme = originalResult.matches.find(s => s.id === hypoScheme.id);
            const scoreDelta = originalScheme ? hypoScheme.matchScore - originalScheme.matchScore : hypoScheme.matchScore;
            
            return {
                scheme_id: hypoScheme.id,
                scheme_name: hypoScheme.scheme_name,
                original_score: originalScheme ? originalScheme.matchScore : 0,
                new_score: hypoScheme.matchScore,
                delta: scoreDelta,
                impact: scoreDelta > 0 ? "Positive" : scoreDelta < 0 ? "Negative" : "Neutral"
            };
        });

        return {
            original_profile: originalProfile,
            hypothetical_profile: hypotheticalProfile,
            simulated_impact: impactDelta
        };
    }
};

module.exports = SimulationAgent;
