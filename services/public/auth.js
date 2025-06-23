const logger = require("../../domain/logs")
const allErrors = require("../../domain/errors")
const {authRepo} = require("../../repo/public")
const {withTransaction} = require("../../utils/transactionWrapper")
const emailOTPService = require('../../helper/email');

const register = async (email) => {
    try {

        const emailOTPResponse = await emailOTPService.generateAndSendOTP(email);
        if(emailOTPResponse.status === 'error'){
            return emailOTPResponse
        }   
        console.log("till here ", emailOTPResponse)
        
        const response = await withTransaction(async (t) => {
            let response = await authRepo.addOTPInfo(email, emailOTPResponse.otp, t)
        })

        return {
            status: "SUCCESS",
            message: "OTP sent successfully"
        }
    } catch (err) {
        return handleError(err);
    }
};

const verifyOTP = async (email, otp) => {
    try {

        const otpResponse = await authRepo.verifyOTP(email, otp);
        if(!otpResponse){
            return {
                status:"ERROR",
                message: "Invalid OTP"
            }
        }   
        console.log("till here ", otpResponse)
        const userInfo = await authRepo.getUserInfo(email);
        if(userInfo){
            return {
                status:"SUCCESS",
                data: userInfo?.id
            }
        } else {
            const response = await withTransaction(async (t) => {
                const id = 'NEX' + Math.floor(100000 + Math.random() * 900000)
                let response = await authRepo.createUser(id, email, t)
                return response
            })
            return {
                status:"SUCCESS",
                data: response?.id
            }
        }
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

module.exports = {register, verifyOTP}