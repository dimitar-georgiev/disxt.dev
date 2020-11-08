const express = require('express');

const {requireAuth} = require('../../middlewares/requireAuth');
const {User} = require('../../models/user');
const {Product} = require('../../models/product');
const {NotFoundError} = require('../../errors/notFound');

const router = express.Router();

router.get('/api/products/:productId', requireAuth, async (req, res) => {
    const user = await User.findById(req.currentUser.id);

    let product;

    if (user.role !== 'admin') {
        product = await Product.findById(req.params.productId).select('-created_by');
    }
    else {
        product = await Product.findById(req.params.productId);
    }
    
    if (!product) {
        throw new NotFoundError();
    }

    res.status(200).send(product);
});

exports.showProductRouter = router;