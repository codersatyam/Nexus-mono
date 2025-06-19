const {register, login} = require("./auth")
const {getExpenses, addExpense} = require("./expense")

module.exports = {
    authService : {
        register: register,
        login : login
    },
    expenseService : {
        getExpenses : getExpenses,
        addExpense : addExpense
    }

};
