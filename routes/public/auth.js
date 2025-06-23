const express = require("express");
const router = express.Router();
const logger = require('../../domain/logs')
const { authService } = require('../../services/public');
const allErrors = require("../../domain/errors");

router.post('/register', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).send({
                status: 'error',
                message: 'Email is required'
            });
        }

        const response = await authService.register(email);
        
        if (response.status === 'SUCCESS') {
            res.status(200).send(response);
        } else {
            res.status(400).send(response);
        }
    } catch (err) {
        handleError(err, res);
    }
});

router.post('/verifyOTP', async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            return res.status(400).send({
                status: 'error',
                message: 'Email and OTP are required'
            });
        }

        const response = await authService.verifyOTP(email, otp);

        if (response.status === 'SUCCESS') {
            res.status(200).send(response);
        } else {
            res.status(400).send(response);
        }
    } catch (err) {
        handleError(err, res);
    }
});


const handleError = (err, res) => {
    res.status(400);
    if (err instanceof allErrors.EmployeeManagementErrors) {
        res.send(err.getJSONError());
    } else {
        logger.error(err);
        res.send(allErrors.unexpectedError);
    }
};

module.exports = router;


