/**
 * EligibilityAgent.js
 * 
 * ROLE: The Symbolic AI Reasoning Component.
 * FUNCTION: Deterministic rule-based evaluation of user attributes against scheme policies.
 * 
 * DESIGN PATTERN: Expert System / Rule Engine.
 */

const EligibilityAgent = {
    /**
     * FIPA Message Interface
     */
    handleMessage: async (fipaMessage) => {
        const { intent, content } = fipaMessage;
        
        switch (intent) {
            case "REQUEST_SYMBOLIC_EVALUATION":
                console.log("[EligibilityAgent] Performing Deterministic Reasoning...");
                return EligibilityAgent.evaluate(content.profile, content.schemes);
            case "REQUEST_HYPOTHETICAL_SIMULATION":
                return EligibilityAgent.simulate(content.profile, content.schemes);
            default:
                throw new Error(`[EligibilityAgent] Unknown Intent: ${intent}`);
        }
    },

    /**
     * Symbolic AI Evaluation Logic
     * Deterministic, transparent, and reproducible.
     */
    evaluate: (userProfile, schemes) => {
        // Tunable Weights for Recommendation Confidence (Symbolic Scoring)
        const WEIGHTS = {
            OCCUPATION: 30,
            INCOME: 20,
            CATEGORY: 20,
            RESIDENCE: 15,
            AGE: 15,
            PREFERRED_FIELD: 25 // Optional boost for user preference
        };

        const evaluatedMatches = schemes.map(scheme => {
            let score = 0;
            let totalPossibleWeight = 0;
            let reasoning_path = []; // Mathematical Audit Trail
            const { eligibility } = scheme;

            // --- START STRICT VETO RULES ---
            
            // Veto 1: Gender Match (Hard Disqualification)
            if (eligibility.gender && userProfile.gender && userProfile.gender !== 'Other') {
                if (userProfile.gender !== eligibility.gender) {
                    return { ...scheme, matchScore: 0, reasoningPath: `VETO: GENDER_MISMATCH(User:${userProfile.gender}, Scheme:${eligibility.gender})` };
                }
            }

            // Veto 2: Age Bounds (Hard Disqualification)
            if (eligibility.age_min || eligibility.age_max) {
                const ageMin = eligibility.age_min || 0;
                const ageMax = eligibility.age_max || 150;
                if (userProfile.age < ageMin || userProfile.age > ageMax) {
                    return { ...scheme, matchScore: 0, reasoningPath: `VETO: AGE_OUT_OF_BOUNDS(${ageMin} <= UserAge(${userProfile.age}) <= ${ageMax})` };
                }
            }

            // Veto 3: Strict Occupation/Category (Heavy Penalty / Veto)
            if (eligibility.occupation && userProfile.occupation) {
                if (userProfile.occupation !== eligibility.occupation) {
                    // If scheme is specific to an occupation (e.g. Farmer) and user is not, reject
                    return { ...scheme, matchScore: 0, reasoningPath: `VETO: OCCUPATION_MISMATCH(User:${userProfile.occupation}, Scheme:${eligibility.occupation})` };
                }
            }

            // --- END STRICT VETO RULES ---

            // Rule 1: Occupation Match (Redundant due to Veto, but kept for score weight)
            if (eligibility.occupation) {
                totalPossibleWeight += WEIGHTS.OCCUPATION;
                if (userProfile.occupation === eligibility.occupation) {
                    score += WEIGHTS.OCCUPATION;
                    reasoning_path.push(`RULE_OCCUPATION_MATCH`);
                }
            }

            // Rule 2: Income Threshold
            if (eligibility.income_limit !== undefined && eligibility.income_limit !== null) {
                totalPossibleWeight += WEIGHTS.INCOME;
                if (userProfile.income <= eligibility.income_limit || userProfile.isBPL) {
                    score += WEIGHTS.INCOME;
                    reasoning_path.push(`RULE_INCOME_VALID`);
                }
            }

            // Rule 3: Social Category Inclusion
            if (eligibility.social_category && eligibility.social_category.length > 0) {
                totalPossibleWeight += WEIGHTS.CATEGORY;
                if (eligibility.social_category.includes(userProfile.socialCategory)) {
                    score += WEIGHTS.CATEGORY;
                    reasoning_path.push(`RULE_CATEGORY_MATCH`);
                }
            }

            // Rule 4: Residential Eligibility
            if (eligibility.residence) {
                totalPossibleWeight += WEIGHTS.RESIDENCE;
                if (userProfile.residence === eligibility.residence) {
                    score += WEIGHTS.RESIDENCE;
                    reasoning_path.push(`RULE_RESIDENCE_MATCH`);
                }
            }

            // Rule 5: Age Constraint (Already Vetoed, but adds to score weight)
            if (eligibility.age_min || eligibility.age_max) {
                totalPossibleWeight += WEIGHTS.AGE;
                score += WEIGHTS.AGE; // Full score if it passed Veto
                reasoning_path.push(`RULE_AGE_VALID`);
            }

            // Rule 6: Preferred Field Match
            if (userProfile.preferredField && userProfile.preferredField !== 'Any' && scheme.category) {
                if (userProfile.preferredField.toLowerCase() !== scheme.category.toLowerCase()) {
                    return { ...scheme, matchScore: 0, reasoningPath: `DISQUALIFIED: FIELD_MISMATCH` };
                } else {
                    score += WEIGHTS.PREFERRED_FIELD;
                    totalPossibleWeight += WEIGHTS.PREFERRED_FIELD;
                    reasoning_path.push(`RULE_PREFERENCE_MATCH`);
                }
            }

            let finalMatchPercentage = totalPossibleWeight > 0 ? Math.round((score / totalPossibleWeight) * 100) : 100;

            return {
                ...scheme,
                matchScore: finalMatchPercentage,
                reasoningPath: reasoning_path.join(' | ')
            };
        })
        .filter(s => s.matchScore >= 60) // High Score Threshold
        .sort((a, b) => b.matchScore - a.matchScore);

        return { matches: evaluatedMatches };
    },

    simulate: (profile, schemes) => {
        return EligibilityAgent.evaluate(profile, schemes);
    }
};

module.exports = EligibilityAgent;
