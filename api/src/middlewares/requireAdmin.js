const {Forbidden} = require('../errors/forbidden');

const {User} = require('../models/user');

const requireAdmin = async (req, res, next) => {
    const user = await User.findById(req.currentUser.id);

    if (user.role !== 'admin') {
        throw new Forbidden();
    }

    next();
};

exports.requireAdmin = requireAdmin;