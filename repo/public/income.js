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

const addIncome = async (userId, record, t) => {
    try {
        const income = await db.incomes.create({
            userId: userId,
            ...record,
        },{transaction:t}
    );

        return income;
    } catch (error) {
        logger.error('Error in addIncome repository:', error);
        throw error;
    }
};

const getIncomes = async (userId) => {
    try {
        const incomes = await db.incomes.findAll({where: {userId: userId}, order: [['incomeDate', 'DESC']]});
        return incomes;
    } catch (error) {
        logger.error('Error in getIncomes repository:', error);
        throw error;
    }
};

module.exports = {
    getUserByPhoneNo,
    getIncomes,
    addIncome
};