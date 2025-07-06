const bcrypt = require('bcrypt');
const { randomUUID } = require('crypto');
const logger = require("../../domain/logs")
const allErrors = require("../../domain/errors")
const {incomeRepo} = require("../../repo/public")
const {withTransaction} = require("../../utils/transactionWrapper")

const addIncome = async (userId, record) => {
    try {
        const incomeId = "NEXUS-" + randomUUID();
        record.id = incomeId;
        const response = await withTransaction(async (t) => {
            const result = await incomeRepo.addIncome(userId, record, t);
            return result;
        });

        return {
            status: 'success',
            data: response
        };
    } catch (err) {
        logger.error("Error in addIncome service:", err);
        return handleError(err);
    }
};

const getIncomes = async (userId) => {
    try {
        const incomes = await incomeRepo.getIncomes(userId);
        return {
            status: 'success',
            data: incomes
        };
    } catch (err) {
        logger.error("Error in getIncomes service:", err);
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

module.exports = {getIncomes, addIncome};