const axios = require('axios');
require('dotenv').config();

const OLLAMA_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';

/**
 * Reasoning Agent: Uses RAG-style logic to match user profile with scheme policies.
 */
const reasoningAgent = {
    evaluateEligibility: async (userProfile, schemes) => {
        try {
            // Select only relevant schemes to reduce token count
            const schemeContext = schemes.map(s => ({
                id: s.id,
                name: s.scheme_name,
                eligibility: s.eligibility,
                benefits: s.benefits
            }));

            const prompt = `
            Evaluate the eligibility of this user for the provided government schemes from Jharkhand.
            
            User Profile: ${JSON.stringify(userProfile)}
            Available Schemes: ${JSON.stringify(schemeContext)}
            
            Instructions:
            1. For each scheme, determine if the user is eligible.
            2. Provide a 'reasoning_chain' for each match.
            3. Return only a JSON object in this format:
            {
                "matches": [
                    {
                        "scheme_id": "string",
                        "is_eligible": boolean,
                        "score": number (0-100),
                        "reasoning_chain": "Step-by-step logic why they qualify or not"
                    }
                ]
            }
            `;

            const response = await axios.post(OLLAMA_URL, {
                model: 'llama3:8b',
                prompt: prompt,
                stream: false,
                format: 'json'
            });

            const evaluation = JSON.parse(response.data.response);
            
            // Merge evaluation back with full scheme details
            return evaluation.matches
                .filter(m => m.is_eligible)
                .map(m => {
                    const fullScheme = schemes.find(s => s.id === m.scheme_id);
                    return {
                        ...fullScheme,
                        matchScore: m.score,
                        reasoningChain: m.reasoning_chain
                    };
                })
                .sort((a, b) => b.matchScore - a.matchScore);

        } catch (error) {
            console.error('Reasoning Agent Error:', error.message);
            return [];
        }
    }
};

module.exports = reasoningAgent;
