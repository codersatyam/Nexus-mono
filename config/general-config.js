const path = require('path')
require('dotenv').config();


module.exports = {

    serverPort: process.env.PORT || 5000,
    userServicesSecretKey: process.env.USER_SERVIECS_PUBLIC_KEY,
    jwtSecret: process.env.JWT_SECRET_KEY || 'your-secret-key',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '24',
    encryptionKey: process.env.JWT_ENCRYPTION_KEY,
    leadSuffixes: {
        'BUSINESS_LOAN': 'BL',
        'PERSONAL_LOAN': 'PL',
        'HOME_LOAN': 'HL',
        'EDUCATION_LOAN': 'EL',
        'VEHICLE_LOAN': 'VL',
        'GOLD_LOAN': 'GL',
        'SME_LOAN': 'SL',
        'MICRO_LOAN': 'ML'
    },
} 