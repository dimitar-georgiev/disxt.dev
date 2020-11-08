class Forbidden extends Error {
    statusCode = 403;

    constructor () {
        super ('Forbidden. Insufficient access rights.');
    }

    serializeErrors() {
        return [{message: 'Forbidden. Insufficient access rights.'}];
    }
}

exports.Forbidden = Forbidden;