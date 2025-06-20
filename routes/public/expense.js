const express = require("express");
const router = express.Router();
const generalConfigs = require('../../config/general-config')
const logger = require('../../domain/logs')
const { expenseService } = require('../../services/public');
const allErrors = require("../../domain/errors");

router.get('/all/:phoneNo', async (req, res) => {
    try {
        const phoneNo = req.params.phoneNo;
        const response = await expenseService.getExpenses(phoneNo);
        if (response.status === 'success') {
            res.status(200).send(response);
        } else {
            res.status(400).send(response);
        }
    } catch (err) {
        handleError(err, res);
    }
});

router.post('/addExpense', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                status: 'error',
                message: 'Invalid request body'
            });
        }
        const {phoneNo, title, amount, expenseDate, category, tag, remarks} = req.body;
        if(!phoneNo || !title || !amount || !expenseDate || !category || !tag){
            return res.status(400).send({
                status: 'error',
                message: 'Missing required fields'
            });
        }
        const record = {title, amount, expenseDate, category, tag, remarks};
        const response = await expenseService.addExpense(phoneNo, record);
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


