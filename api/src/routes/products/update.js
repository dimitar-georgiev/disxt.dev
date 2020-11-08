const express = require('express');
const {body} = require('express-validator');

const {requireAuth} = require('../../middlewares/requireAuth');
const {requireAdmin} = require('../../middlewares/requireAdmin');
const {validateRequest} = require('../../middlewares/validateRequest');
const {Product} = require('../../models/product');
const {NotFoundError} = require('../../errors/notFound');

const router = express.Router();

router.put('/api/products/:productId', requireAuth, requireAdmin, [
    body('name')
        .not()
        .isEmpty()
        .withMessage('Name is required.'),
    body('price')
        .not()
        .isEmpty()
        .withMessage('Price is required.'),
    body('description')
        .not()
        .isEmpty()
        .withMessage('Description is required.')
], validateRequest, async (req, res) => {
    const product = await Product.findById(req.params.productId);

    if (!product) {
        throw new NotFoundError();
    }

    const {name, description, price} = req.body;

    product.set({name, description, price});

    await product.save();

    res.status(200).send(product);
});

exports.updateProductRouter = router;