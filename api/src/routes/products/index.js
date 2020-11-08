const express = require('express');

const {requireAuth} = require('../../middlewares/requireAuth');
const {User} = require('../../models/user');
const {Product} = require('../../models/product');

const router = express.Router();

router.get('/api/products', requireAuth, async (req, res) => {

    let products;

    const user = await User.findById(req.currentUser.id);

    if (user.role !== 'admin') {
        products = await Product.find().select('-created_by');
    }
    else {
        products = await Product.find();
    }

    res.status(200).send(products);
});

exports.getAllProductsRouter = router;