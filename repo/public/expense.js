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

const addExpense = async (userId, record, t) => {
    try {
        const expense = await db.expenses.create({
            userId: userId,
            ...record,
        },{transaction:t}
    );

        return expense;
    } catch (error) {
        logger.error('Error in addExpense repository:', error);
        throw error;
    }
};

const getExpenses = async (userId) => {
    try {
        const expenses = await db.expenses.findAll({where: {userId: userId}, order: [['expenseDate', 'DESC']]});
        return expenses;
    } catch (error) {
        logger.error('Error in getExpenses repository:', error);
        throw error;
    }
};

module.exports = {
    getUserByPhoneNo,
    getExpenses,
    addExpense
};