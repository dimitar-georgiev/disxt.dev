const express = require('express');
const {body} = require('express-validator');
const jwt = require('jsonwebtoken');

const {BadRequestError} = require('../../errors/badRequest');
const {validateRequest} = require('../../middlewares/validateRequest');
const {User} = require('../../models/user');
const {JWT_KEY} = require('../../config/config.env');

const router = express.Router();

router.post('/api/users/signup', [
    body('username')
        .trim()
        .isEmail()
        .withMessage('Please provide valid email.'),
    body('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Password is required.')
        .isLength({min: 4})
        .withMessage('Password must be at least 4 characters long.'),
    body('name')
        .not()
        .isEmpty()
        .withMessage('Name is required.'),
    body('lastname')
        .not()
        .isEmpty()
        .withMessage('Las Name is required.')
], validateRequest, async (req, res) => {
    const {username, password, name, lastname, age, role} = req.body;

    const existingUser = await User.findOne({username});

    if (existingUser) {
        throw new BadRequestError('Username already exists.');
    }

    const user = new User({
        username,
        password,
        name, 
        lastname,
        age,
        role
    });
    await user.save();

    const userJWT = jwt.sign({
        id: user._id,
        username: user.username
    }, JWT_KEY);

    req.session = {
        jwt: userJWT
    };

    res.status(201).send(user);
});

exports.signupRouter = router;