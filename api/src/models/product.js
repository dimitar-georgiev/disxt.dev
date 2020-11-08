const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    created_by: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Product = mongoose.model('Product', productSchema);

exports.Product = Product;