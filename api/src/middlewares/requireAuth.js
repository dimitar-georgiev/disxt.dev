const {NotAuthorizedError} = require('../errors/notAuthorized');

const requireAuth = (req, res, next) => {
    if (!req.currentUser) {
        throw new NotAuthorizedError();
    }

    next();
};

exports.requireAuth = requireAuth;