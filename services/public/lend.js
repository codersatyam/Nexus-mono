const bcrypt = require('bcrypt');
const { randomUUID } = require('crypto');
const logger = require("../../domain/logs")
const allErrors = require("../../domain/errors")
const {lendRepo} = require("../../repo/public")
const {withTransaction} = require("../../utils/transactionWrapper")

const addLend = async (userId, record) => {
    try {
        const lendId = "NEXUS-" + randomUUID();
        record.id = lendId;
        const response = await withTransaction(async (t) => {
            const result = await lendRepo.addLend(userId, record, t);
            return result;
        });

        return {
            status: 'success',
            data: response
        };
    } catch (err) {
    logger.error("Error in addLend service:", err);
        return handleError(err);
    }
};

const getLends = async (userId) => {
    try {
        const lends = await lendRepo.getLends(userId);
        return {
            status: 'success',
            data: lends
        };
    } catch (err) {
        logger.error("Error in getLends service:", err);
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

module.exports = {getLends, addLend};