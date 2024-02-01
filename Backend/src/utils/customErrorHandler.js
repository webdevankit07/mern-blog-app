class customError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode <= 500 ? "failed" : "error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const ApiError = (next, condition, statusCode, message) => {
    if (condition) {
        next(new customError(statusCode, message));
    }
};

export default customError;
