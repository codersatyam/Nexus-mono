const logger = require('../domain/logs');
const db = require("../models")

const withTransaction = async (callback) => {
    const t = await db.sequelize.transaction();
    
    try {
        const result = await callback(t);
        await t.commit();
        return result;
    } catch (error) {
        await t.rollback();
        logger.error('Transaction error:', error);
        throw error;
    }
};

module.exports = { withTransaction }; 