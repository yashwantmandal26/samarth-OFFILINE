/**
 * Matches user profile with scheme eligibility rules using a scoring system.
 */
const schemeMatchingAgent = {
    calculateMatch: (userProfile, schemes) => {
        return schemes.map(scheme => {
            let score = 0;
            let reasons = [];
            const { eligibility } = scheme;

            // Occupation match (+30)
            if (eligibility.occupation && userProfile.occupation === eligibility.occupation) {
                score += 30;
                reasons.push(`Matches your occupation as ${userProfile.occupation}`);
            }

            // Income eligibility (+20)
            if (eligibility.income_limit) {
                if (userProfile.income <= eligibility.income_limit || userProfile.isBPL) {
                    score += 20;
                    reasons.push("Meets income eligibility criteria");
                }
            } else if (userProfile.isBPL && eligibility.social_category && eligibility.social_category.includes("BPL")) {
                score += 20;
                reasons.push("Meets BPL criteria");
            }

            // Social category match (+20)
            if (eligibility.social_category && eligibility.social_category.includes(userProfile.socialCategory)) {
                score += 20;
                reasons.push(`Available for ${userProfile.socialCategory} category`);
            }

            // Rural/Urban match (+15)
            if (eligibility.residence && userProfile.residence === eligibility.residence) {
                score += 15;
                reasons.push(`Suitable for ${userProfile.residence} residents`);
            } else if (!eligibility.residence) {
                // If not specified, assume applicable or small bonus
                score += 5;
            }

            // Age match (+15)
            const ageMin = eligibility.age_min || 0;
            const ageMax = eligibility.age_max || 150;
            if (userProfile.age >= ageMin && userProfile.age <= ageMax) {
                score += 15;
                reasons.push("Meets age criteria");
            }

            // Gender match (Critical)
            if (eligibility.gender && userProfile.gender !== eligibility.gender) {
                score = 0; // Disqualify if gender doesn't match and is specified
                reasons = ["Gender eligibility does not match"];
            }

            // Qualification match
            if (eligibility.qualification && userProfile.qualification.toLowerCase().includes(eligibility.qualification.toLowerCase())) {
                score += 10;
                reasons.push(`Matches your educational qualification: ${userProfile.qualification}`);
            }

            return {
                ...scheme,
                matchScore: score,
                matchReasons: reasons
            };
        })
        .filter(s => s.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore);
    }
};

module.exports = schemeMatchingAgent;
