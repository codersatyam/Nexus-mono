const bcrypt = require('bcrypt');
const { randomUUID } = require('crypto');
const logger = require("../../domain/logs")
const allErrors = require("../../domain/errors")
const {investmentRepo} = require("../../repo/public")
const {withTransaction} = require("../../utils/transactionWrapper")

const addInvestment = async (phoneNo, record) => {
    try {
        const user = await investmentRepo.getUserByPhoneNo(phoneNo);
        if(!user){
            return allErrors.userNotFound.getJSONError();
        }
        const userId = user?.id;
        const investmentId = "NEXUS-" + randomUUID();
        record.id = investmentId;
        const response = await withTransaction(async (t) => {
            const result = await investmentRepo.addInvestment(userId, record, t);
            return result;
        });

        return {
            status: 'success',
            data: response
        };
    } catch (err) {
    logger.error("Error in addInvestment service:", err);
        return handleError(err);
    }
};

const getInvestments = async (phoneNo) => {
    try {
        const user = await investmentRepo.getUserByPhoneNo(phoneNo);
        if(!user){
            return allErrors.userNotFound.getJSONError();
        }
        const userId = user?.id;
        const investments = await investmentRepo.getInvestments(userId);
        return {
            status: 'success',
            data: investments
        };
    } catch (err) {
        logger.error("Error in getInvestments service:", err);
        return handleError(err);
    }
};

// Error handler
const handleError = (err) => {
    logger.error("Service DEBUG: ", err);
    if (err instanceof allErrors.EmployeeManagementErrors) {
        return err.getJSONError();
    }
    return allErrors.unexpectedError.getJSONError();
};

module.exports = {getInvestments, addInvestment};