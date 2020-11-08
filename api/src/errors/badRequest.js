class BadRequestError extends Error {
    statusCode = 400;

    constructor (message) {
        super (message);
        this.message = message;
    }

    serializeErrors() {
        return [{message: this.message}];
    }
}

exports.BadRequestError = BadRequestError;