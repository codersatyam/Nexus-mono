const generalConfigs = require('../config/general-config');

const generateLeadId = (phoneNo, productType) => {
    try {
        const getProductSuffix = (type) => {
            return generalConfigs.leadSuffixes[type] || 'LD'; // Default to GL if type not found
        };

        // Get last 4 digits of phone number
        const phoneLast4 = phoneNo.toString().slice(-4);

        // Get current timestamp and take last 4 digits
        const timestamp = Date.now().toString();
        const timeLast4 = timestamp.slice(-4);

        // Combine all parts
        const leadId = `${getProductSuffix(productType)}${phoneLast4}${timeLast4}`;

        return leadId;
    } catch (error) {
        throw new Error('Failed to generate lead ID');
    }
};

module.exports = { generateLeadId };