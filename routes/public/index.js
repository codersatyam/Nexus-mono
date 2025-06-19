const express = require("express")
const router = express.Router()

const expense = require("./expense")

// Verify that each imported route is a valid router middleware
const routes = [
    { path: "/expense", handler: expense},
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