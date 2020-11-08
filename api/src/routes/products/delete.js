const express = require('express');

const {requireAuth} = require('../../middlewares/requireAuth');
const {requireAdmin} = require('../../middlewares/requireAdmin');
const {Product} = require('../../models/product');
const {NotFoundError} = require('../../errors/notFound');

const router = express.Router();

router.delete('/api/products/:productId', requireAuth, requireAdmin, async (req, res) => {
    
    const product = await Product.findByIdAndDelete(req.params.productId);

    if (!product) {
        throw new NotFoundError();
    }
    
    res.status(200).send(product);
});

exports.deleteProductRouter = router;