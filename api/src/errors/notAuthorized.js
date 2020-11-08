class NotAuthorizedError extends Error {
    statusCode = 401;

    constructor () {
        super('Not Authorized.');
    }

    serializeErrors() {
        return [{message: 'Not Authorized.'}];
    }
}

exports.NotAuthorizedError = NotAuthorizedError;