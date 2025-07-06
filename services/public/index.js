const {register, verifyOTP } = require("./auth")
const {getExpenses, addExpense} = require("./expense")
const {getLends, addLend} = require("./lend")
const {getInvestments, addInvestment} = require("./investment")
const {getIncomes, addIncome} = require("./income")
const {generateAndSendOTP, resendOTP, getOTPStatus} = require("./emailOTP")

module.exports = {
    authService : {
        register: register,
        verifyOTP: verifyOTP
    },
    expenseService : {
        getExpenses : getExpenses,
        addExpense : addExpense
    },
    lendService : {
        getLends : getLends,
        addLend : addLend
    },
    investmentService : {
        getInvestments : getInvestments,
        addInvestment : addInvestment
    },
    incomeService : {
        getIncomes : getIncomes,
        addIncome : addIncome
    },
    emailOTPService : {
        generateAndSendOTP : generateAndSendOTP,
        verifyOTP : verifyOTP,
        resendOTP : resendOTP,
        getOTPStatus : getOTPStatus
    }
};
