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
            AGE: 15
        };

        const evaluatedMatches = schemes.map(scheme => {
            let score = 0;
            let totalPossibleWeight = 0;
            let reasoning_path = []; // Mathematical Audit Trail
            const { eligibility } = scheme;

            // Rule 1: Occupation Match
            if (eligibility.occupation) {
                totalPossibleWeight += WEIGHTS.OCCUPATION;
                if (userProfile.occupation === eligibility.occupation) {
                    score += WEIGHTS.OCCUPATION;
                    reasoning_path.push(`RULE_OCCUPATION_MATCH: User(${userProfile.occupation}) == Scheme(${eligibility.occupation})`);
                }
            }

            // Rule 2: Income Threshold
            if (eligibility.income_limit) {
                totalPossibleWeight += WEIGHTS.INCOME;
                if (userProfile.income <= eligibility.income_limit || userProfile.isBPL) {
                    score += WEIGHTS.INCOME;
                    reasoning_path.push(`RULE_INCOME_VALID: UserIncome(${userProfile.income}) <= Limit(${eligibility.income_limit})`);
                }
            }

            // Rule 3: Social Category Inclusion
            if (eligibility.social_category && eligibility.social_category.length > 0) {
                totalPossibleWeight += WEIGHTS.CATEGORY;
                if (eligibility.social_category.includes(userProfile.socialCategory)) {
                    score += WEIGHTS.CATEGORY;
                    reasoning_path.push(`RULE_CATEGORY_MATCH: UserCategory(${userProfile.socialCategory}) IN [${eligibility.social_category.join(',')}]`);
                }
            }

            // Rule 4: Residential Eligibility
            if (eligibility.residence) {
                totalPossibleWeight += WEIGHTS.RESIDENCE;
                if (userProfile.residence === eligibility.residence) {
                    score += WEIGHTS.RESIDENCE;
                    reasoning_path.push(`RULE_RESIDENCE_MATCH: UserArea(${userProfile.residence}) == SchemeArea(${eligibility.residence})`);
                }
            }

            // Rule 5: Age Constraint
            if (eligibility.age_min || eligibility.age_max) {
                totalPossibleWeight += WEIGHTS.AGE;
                const ageMin = eligibility.age_min || 0;
                const ageMax = eligibility.age_max || 150;
                if (userProfile.age >= ageMin && userProfile.age <= ageMax) {
                    score += WEIGHTS.AGE;
                    reasoning_path.push(`RULE_AGE_VALID: ${ageMin} <= UserAge(${userProfile.age}) <= ${ageMax}`);
                }
            }

            // Normalization: Scale score to 100% based on defined rules
            // If no specific rules were defined (rare), default to a baseline match
            let finalMatchPercentage = 0;
            if (totalPossibleWeight > 0) {
                finalMatchPercentage = Math.round((score / totalPossibleWeight) * 100);
            } else {
                finalMatchPercentage = 100; // General schemes apply to everyone
            }

            // Hard Disqualification: Gender (If defined and mismatched, score becomes 0)
            if (eligibility.gender && userProfile.gender !== eligibility.gender) {
                finalMatchPercentage = 0;
                reasoning_path = [`DISQUALIFIED: GENDER_MISMATCH(User:${userProfile.gender}, Scheme:${eligibility.gender})`];
            }

            return {
                ...scheme,
                matchScore: finalMatchPercentage,
                reasoningPath: reasoning_path.join(' | ') // FIPA Content for Explanation Agent
            };
        })
        .filter(s => s.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore);

        return { matches: evaluatedMatches };
    },

    simulate: (profile, schemes) => {
        return EligibilityAgent.evaluate(profile, schemes);
    }
};

module.exports = EligibilityAgent;
