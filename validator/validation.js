const allErrors = require('../domain/errors');

const validateLead = (data) => {
    const requiredFields = [
        'phoneNo',
        'productType',
        'productId',
        'organizationId',
        'applicationDetails'
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
        throw allErrors.missingFields(missingFields);
    }

    // Validate phone number format
    if (!/^[0-9]{10}$/.test(data.phoneNo)) {
        throw allErrors.invalidField('phoneNo', 'Invalid phone number format');
    }

    // Validate application details
    if (typeof data.applicationDetails !== 'object') {
        throw allErrors.invalidField('applicationDetails', 'Application details must be an object');
    }
    return true;
};

module.exports = {
    validateLead
};