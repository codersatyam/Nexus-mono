const bcrypt = require('bcrypt');
const { randomUUID } = require('crypto');
const logger = require("../../domain/logs")
const allErrors = require("../../domain/errors")
const {expenseRepo} = require("../../repo/public")
const {withTransaction} = require("../../utils/transactionWrapper")

const addExpense = async (userId, record) => {
    try {
        const expenseId = "NEXUS-" + randomUUID();
        record.id = expenseId;
        const response = await withTransaction(async (t) => {
            const result = await expenseRepo.addExpense(userId, record, t);
            return result;
        });

        return {
            status: 'success',
            data: response
        };
    } catch (err) {
        logger.error("Error in addExpense service:", err);
        return handleError(err);
    }
};

const getExpenses = async (userId) => {
    try {
        const expenses = await expenseRepo.getExpenses(userId);
        return {
            status: 'success',
            data: expenses
        };
    } catch (err) {
        logger.error("Error in getExpenses service:", err);
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

module.exports = {getExpenses, addExpense};