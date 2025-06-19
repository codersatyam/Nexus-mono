const { Op } = require('sequelize');
const logger = require('../../domain/logs');
const db = require('../../models');



const checkUserBanned = async (phoneNo) => {
    try {
        return await db.users.findOne({
            where: {phoneNo},
        });
    } catch (error) {
        logger.error('Error in getting userInfo:', error);
        throw error;
    }
};

const addOTPInfo = async (phoneNo, otp, t) => {
    try {
            return await db.otp.create({phoneNo, otp},{transaction:t})
    } catch (error) {
        logger.error('Error in getAllProducts repository:', error);
        throw error;
    }
}

const createUser = async () => {
    try {
        const products = await db.user.create({},{transaction:t});
        return products;
    } catch (error) {
        logger.error('Error in getAllProducts repository:', error);
        throw error;
    }
}

module.exports = {
    checkUserBanned,
    addOTPInfo,
    createUser
};