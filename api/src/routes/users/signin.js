const express = require('express');
const jwt = require('jsonwebtoken');
const {body} = require('express-validator');

const {BadRequestError} = require('../../errors/badRequest');
const {validateRequest} = require('../../middlewares/validateRequest');
const {User} = require('../../models/user');
const {Password} = require('../../services/password');
const {JWT_KEY} = require('../../config/config.env');

const router = express.Router();

router.post('/api/users/signin', [
    body('username')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email.'),
    body('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Please provide a valid password.')
        .isLength({min: 4})
        .withMessage('Password must be at least 4 characters long.'),
], validateRequest, async (req, res) => {
    const {username, password} = req.body;

    const existingUser = await User.findOne({username});

    if (!existingUser) {
        throw new BadRequestError('Invalid Credentials');
    }

    const passMatch = await Password.compare(existingUser.password, password);

    if (!passMatch) {
        throw new BadRequestError('Invalid Credentials');
    }

    const userJWT = jwt.sign({
        id: existingUser._id,
        username: existingUser.username
    }, JWT_KEY);

    req.session = {
        jwt: userJWT
    };

    res.status(200).send(existingUser);
});

exports.signinRouter = router; 