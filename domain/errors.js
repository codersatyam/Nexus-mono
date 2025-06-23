const AppError = (message, statusCode) => {
const error = new Error(message);
error.statusCode = statusCode;
error.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
error.isOperational = true;
error.getJSONError = function() {
    return {
        status: this.status,
        message: this.message,
        statusCode: this.statusCode
    };
};
Error.captureStackTrace(error, AppError);
return error;
};

// Custom error class for employee management
class EmployeeManagementErrors extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, EmployeeManagementErrors);
    }

    getJSONError() {
        return {
            status: this.status,
            message: this.message,
            statusCode: this.statusCode
        };
    }
}

const allErrors = {

// User service errors
userAlreadyExists: AppError('User already exists', 409),
userNotFound: AppError('User not found', 404),
invalidCredentials: AppError('Invalid credentials', 401),

// Auth service errors
invalidToken: AppError('Invalid Token', 401),

// Validation errors
missingData: AppError('Missing required data', 400),
missingField: (field) => AppError(`Missing required field: ${field}`, 400),
missingFields: (fields) => AppError(`Missing required fields: ${fields.join(', ')}`, 400),
invalidField: (field, message) => AppError(`${field}: ${message}`, 400),

// Product errors
productNotFound: AppError('Product not found', 404),
invalidProductData: AppError('Invalid product data', 400),

// Organization errors
orgNotFound: AppError('Organization not found', 404),
invalidOrgAccess: AppError('Invalid organization access', 403),
invalidProduct: AppError("Invalid Product", 400),

// General errors
unexpectedError: AppError('Unexpected error occurred', 500)

};

// Add EmployeeManagementErrors to allErrors
allErrors.EmployeeManagementErrors = EmployeeManagementErrors;

module.exports = allErrors;
  