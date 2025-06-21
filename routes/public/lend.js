const express = require("express");
const router = express.Router();
const generalConfigs = require('../../config/general-config')
const logger = require('../../domain/logs')
const { lendService } = require('../../services/public');
const allErrors = require("../../domain/errors");

router.get('/all/:phoneNo', async (req, res) => {
    try {
        const phoneNo = req.params.phoneNo;
        const response = await lendService.getLends(phoneNo);
        if (response.status === 'success') {
            res.status(200).send(response);
        } else {
            res.status(400).send(response);
        }
    } catch (err) {
        handleError(err, res);
    }
});

router.post('/addLend', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                status: 'error',
                message: 'Invalid request body'
            });
        }
        const {phoneNo, name, title, amount, lendDate, status, remarks} = req.body;
        if(!phoneNo || !name || !title || !amount || !lendDate || !status){
            return res.status(400).send({
                status: 'error',
                message: 'Missing required fields'
            });
        }
        const record = {name, title, amount, lendDate, status, remarks, dueAmount : amount, partialAmount : 0};
        const response = await lendService.addLend(phoneNo, record);
        if (response.status === 'success') {
            res.status(200).send(response);
        } else {
            res.status(400).send(response);
        }
    } catch (err) {
        handleError(err, res);
    }
});

router.post('/updateLend', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                status: 'error',
                message: 'Invalid request body'
            });
        }
        const {lendId, amount, status, remarks} = req.body;
        if(!lendId || !amount || !status){
            return res.status(400).send({
                status: 'error',
                message: 'Missing required fields'
            });
        }
        const response = await lendService.updateLend(lendId, amount, status, remarks);
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


