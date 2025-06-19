const bcrypt = require('bcrypt');
const logger = require("../domain/logs")
const allErrors = require("../domain/errors")

const generateOTP = async () => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpString = otp.toString().padStart(6, '0');
        
        return  otpString
    } catch (err) {
        return handleError(err);
    }
}


const handleError = (err) => {
    logger.error("Service DEBUG: ", err);
    if (err instanceof allErrors.EmployeeManagementErrors) {
        return err.getJSONError();
    }
    return allErrors.unexpectedError.getJSONError();
};

module.exports = {generateOTP};    