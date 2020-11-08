const express = require('express');
const {body} = require('express-validator');

const {requireAuth} = require('../../middlewares/requireAuth');
const {requireAdmin} = require('../../middlewares/requireAdmin');
const {validateRequest} = require('../../middlewares/validateRequest');
const {Product} = require('../../models/product');

const router = express.Router();

router.post('/api/products', requireAuth, requireAdmin, [
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

    const {name, price, description} = req.body;

    const product = new Product({
        name,
        price,
        description,
        created_by: req.currentUser.id
    });
    await product.save();

    res.status(201).send(product);
});

exports.createNewProductRouter = router;