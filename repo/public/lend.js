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

const addLend = async (userId, record, t) => {
    try {
        const lend = await db.lends.create({
            userId: userId,
            ...record,
        },{transaction:t}
    );

        return lend;
    } catch (error) {
        logger.error('Error in addLend repository:', error);
        throw error;
    }
};

const getLends = async (userId) => {
    try {
        const lends = await db.lends.findAll({where: {userId: userId}, order: [['lendDate', 'DESC']]});
        return lends;
    } catch (error) {
        logger.error('Error in getLends repository:', error);
        throw error;
    }
};

module.exports = {
    getUserByPhoneNo,
    getLends,
    addLend
};