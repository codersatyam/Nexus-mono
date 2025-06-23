const express = require("express");
const router = express.Router();
const generalConfigs = require('../../config/general-config')
const logger = require('../../domain/logs')
const { investmentService } = require('../../services/public');
const allErrors = require("../../domain/errors");

router.get('/all/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const response = await investmentService.getInvestments(userId);
        if (response.status === 'success') {
            res.status(200).send(response);
        } else {
            res.status(400).send(response);
        }
    } catch (err) {
        handleError(err, res);
    }
});

router.post('/addInvestment', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                status: 'error',
                message: 'Invalid request body'
            });
        }
        const {phoneNo, title, amount, investmentDate, category, tag, remarks} = req.body;
        if(!phoneNo || !title || !amount || !investmentDate || !category){
            return res.status(400).send({
                status: 'error',
                message: 'Missing required fields'
            });
        }
        const record = {title, amount, investmentDate, category, tag, remarks};
        const response = await investmentService.addInvestment(phoneNo, record);
        if (response.status === 'success') {
            res.status(200).send(response);
        } else {
            res.status(400).send(response);
        }
    } catch (err) {
        handleError(err, res);
    }
});


const handleError = (err, res) => {
    logger.error("Route error:", err);
    if (err instanceof allErrors.EmployeeManagementErrors) {
        res.status(err.statusCode).send(err.getJSONError());
    } else {
        res.status(500).send(allErrors.unexpectedError.getJSONError());
    }
};

module.exports = router;


