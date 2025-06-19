const errors = require("../domain/errors")
const generelConfig =  require("../config/general-config")
module.exports = 

    class AuthServicesValidator {   

        validateSendOTPReq(req) {
            if (req.body !== undefined) {
                const phoneNumber = req.body.phoneNumber
                let valid = false;
                if (phoneNumber === undefined) {
                    return {
                        valid: false,
                        error: errors.phoneNumberRequired
                    }
                } else if (phoneNumber.length < 10) {
                    return {
                        valid: false,
                        error: errors.phoneNumberInvalid
                    }
                } 
                return {
                    valid: true,
                    validatedData: {
                        phoneNumber: phoneNumber
                    }
                }
            }
            return {
                valid: false,
                error: errors.phoneNumberRequired
            }
        }
    }
