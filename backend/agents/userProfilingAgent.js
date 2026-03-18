/**
 * Collects and structures user attributes from raw input
 */
const userProfilingAgent = {
    processProfile: (userData) => {
        return {
            name: userData.name || 'Citizen',
            age: parseInt(userData.age) || 0,
            gender: userData.gender || 'Not specified',
            occupation: userData.occupation || 'Not specified',
            income: parseInt(userData.income) || 0,
            socialCategory: userData.socialCategory || 'General',
            district: userData.district || 'Not specified',
            residence: userData.residence || 'Urban', // Default to Urban
            qualification: userData.qualification || 'None',
            isBPL: userData.isBPL || false,
            housingStatus: userData.housingStatus || 'Own',
            landHolding: userData.landHolding || 'None',
            preferredField: userData.preferredField || 'Any',
            specialStatus: userData.specialStatus || [] // Widows, Disabled, etc.
        };
    }
};

module.exports = userProfilingAgent;
