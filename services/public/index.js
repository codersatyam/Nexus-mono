const {register, login} = require("./auth")
const {getExpenses, addExpense} = require("./expense")
const {getLends, addLend} = require("./lend")
module.exports = {
    authService : {
        register: register,
        login : login
    },
    expenseService : {
        getExpenses : getExpenses,
        addExpense : addExpense
    },
    lendService : {
        getLends : getLends,
        addLend : addLend
    }

};
