class RequestValidationError extends Error {
    statusCode = 400;

    constructor (errors) {
        super ('Invalid Request Parameters.');
        this.errors = errors;
    }

    serializeErrors() {
        const formattedErrors = this.errors.map(err => {
            return {
                message: err.msg,
                field: err.param
            };
        });

        return formattedErrors;
    }
}

exports.RequestValidationError = RequestValidationError;