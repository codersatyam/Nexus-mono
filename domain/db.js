const models = require('../models');
const logger = require('./logs')

const connectDB = async () => {
    try {
        await models.sequelize.authenticate();
        logger.info('postgresDB Connected....');
    } catch (err) {
        logger.error('Unable to connect to postgresDB: ', err);
    }
}

module.exports = connectDB