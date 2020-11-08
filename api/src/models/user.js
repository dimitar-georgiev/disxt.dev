const mongoose = require('mongoose');

const {Password} = require('../services/password');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    role: {
        type: String,
        required: true,
        default: 'client'
    }
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
        }
    }
});

userSchema.pre('save', async function(done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));

        this.set('password', hashed);
    }
    done();
});

const User = mongoose.model('User', userSchema);

exports.User = User;