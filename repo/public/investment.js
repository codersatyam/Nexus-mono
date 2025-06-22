const { Op } = require('sequelize');
const logger = require('../../domain/logs');
const db = require('../../models');

const getUserByPhoneNo = async (phoneNo) => {
    try {
        const user = await db.users.findOne({where: {phoneNo: phoneNo}, raw: true});
        return user;
    } catch (error) {
        logger.error('Error in getUserByPhoneNo repository:', error);
        throw error;
    }
};

const addInvestment = async (userId, record, t) => {
    try {
        const investment = await db.investments.create({
            userId: userId,
            ...record,
        },{transaction:t}
    );

        return investment;
    } catch (error) {
        logger.error('Error in addInvestment repository:', error);
        throw error;
    }
};

const getInvestments = async (userId) => {
    try {
        const investments = await db.investments.findAll({where: {userId: userId}, order: [['investmentDate', 'DESC']]});
        return investments;
    } catch (error) {
        logger.error('Error in getInvestments repository:', error);
        throw error;
    }
};

module.exports = {
    getUserByPhoneNo,
    getInvestments,
    addInvestment
};