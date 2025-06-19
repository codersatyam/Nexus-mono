const express = require("express");
const router = express.Router();
const generalConfigs = require('../../config/general-config')
const logger = require('../../domain/logs')
const { validateLoginBody } = require('../../validator/authValidator');
const { authServicesInstance } = require('../../services/public');
const allErrors = require("../../domain/errors");

router.post('/profile', async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).send("Invalid request body");
        }
        await validateLoginBody(req.body);
        const response = await authServicesInstance.login(req.body);
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


