const expenseRepo = require("./expense")
const authRepo = require("../public/auth")
const lendRepo = require("../public/lend")
const investmentRepo = require("../public/investment")

module.exports = {
    expenseRepo,
    authRepo,
    lendRepo,
    investmentRepo
};
