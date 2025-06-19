const bcrypt = require('bcrypt');
const logger = require("../../domain/logs")
const allErrors = require("../../domain/errors")
const authHelper = require("../../helper/auth")
const {authRepo} = require("../../repo/public")

const register = async (registerData) => {
    try {
        let {phoneNo} = registerData
        let userDetails = await authRepo.checkUserBanned(phoneNo);
        // if (userDetails['isBanned']) throw this.allErrors.accountBanned;
        // if (userDetails['isDeleted']) throw this.allErrors.accountDeleted;

        const OTP = await authHelper.generateOTP();
        const smsResponse = await notificationHelper.sendOTP(phoneNo, OTP)
        const response = await withTransaction(async (t) => {
            let response = await authRepo.addOTPInfo(phoneNo, OTP)
        })

        return {
            status: "Success",
            data: {
                otp:OTP
                }
            }
    } catch (err) {
        return handleError(err);
    }
};

const login = async (loginData) => {
    try {

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

module.exports = {register, login}