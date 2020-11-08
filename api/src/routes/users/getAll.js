const express = require('express');

const {User} = require('../../models/user');

const router = express.Router();

router.get('/api/users', async (req, res) => {
    const users = await User.find();

    // console.log('Users: ', users);

    res.status(200).send(users);
});

exports.showAllUsersRouter = router;