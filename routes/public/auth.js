const express = require("express");
const router = express.Router();
const generalConfigs = require('../../config/general-config')
const logger = require('../../domain/logs')
const { validateLoginBody } = require('../../helper/notification');
const { authService } = require('../../services/public');
const allErrors = require("../../domain/errors");

router.post('/register', async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).send("Invalid request body");
        }
        const response = await authService.register(req.body);
        if (!response.err) {
            res.status(200).send(response);
        } else {
            res.status(400).send(response.err);
        }
    } catch (err) {
        handleError(err, res);
    }
});

router.post('/login', async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).send("Invalid request body");
        }
        await validateLoginBody(req.body);
        const response = await authService.login(req.body);
        if (!response.err) {
            res.status(200).send(response);
        } else {
            res.status(400).send(response.err);
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


