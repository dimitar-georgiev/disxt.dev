const jwt = require('jsonwebtoken');

const {JWT_KEY} = require('../config/config.env');

const currentUser = (req, res, next) => {
    // console.log('Current Session: ', req.session.jwt);
    if (!req.session.jwt) {
        return next();
    }

    try {
        const payload = jwt.verify(req.session.jwt, JWT_KEY);

        req.currentUser = payload;
    }
    catch (err) {}

    next();
}

exports.currentUser = currentUser;