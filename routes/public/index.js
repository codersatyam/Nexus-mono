const express = require("express")
const router = express.Router()

const expense = require("./expense")
const lend = require("./lend")
const investment = require("./investment")
const auth = require("./auth")
const income = require("./income")

// Verify that each imported route is a valid router middleware
const routes = [
    { path: "/expense", handler: expense},
    { path: "/lend", handler: lend},
    { path: "/investment", handler: investment},
    { path: "/auth", handler: auth},
    { path: "/income", handler: income},
];

// Add routes with validation
routes.forEach(({ path, handler }) => {
    if (handler && typeof handler.use === 'function') {
        router.use(path, handler);
    } else {
        console.error(`Invalid router handler for path: ${path}`);
    }
});

module.exports = router