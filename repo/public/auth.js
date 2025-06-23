const { Op } = require('sequelize');
const logger = require('../../domain/logs');
const db = require('../../models');



const addOTPInfo = async (email, otp, t) => {
    try {
        return await db.otps.create({email, otp},{transaction:t})
    } catch (error) {
        logger.error('Error in getAllProducts repository:', error);
        throw error;
    }
}

const verifyOTP = async (email, otp) => {
    try {
        return await db.otps.findOne({where: {email, otp},raw:true})
    } catch (error) {
        logger.error('Error in verifyOTP repository:', error);
        throw error;
    }
}

const getUserInfo = async (email) => {
    try {
        return await db.users.findOne({where: {email},raw:true})
    } catch (error) {
        logger.error('Error in getUserInfo repository:', error);
        throw error;
    }
}

const createUser = async (id, email, t) => {
    try {
        return await db.users.create({id,email}, {transaction: t})
    } catch (error) {
        logger.error('Error in createUser repository:', error);
        throw error;
    }
}


module.exports = {
    addOTPInfo,
    verifyOTP,
    getUserInfo,
    createUser
};