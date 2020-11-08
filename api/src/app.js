const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

const {errorHandler} = require('./middlewares/errorHandler');
const {NotFoundError} = require('./errors/notFound');

const {signupRouter} = require('./routes/users/signup');
const {signinRouter} = require('./routes/users/signin');
const {signoutRouter} = require('./routes/users/signout');

const {getAllProductsRouter} = require('./routes/products/index');
const {createNewProductRouter} = require('./routes/products/new');
const {showProductRouter} = require('./routes/products/show');
const {updateProductRouter} = require('./routes/products/update');
const {deleteProductRouter} = require('./routes/products/delete');

const {currentUser} = require('./middlewares/currentUser');

const app = express();

app.set('trust proxy', true);

app.use(bodyParser.json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUser);

app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.use(getAllProductsRouter);
app.use(createNewProductRouter);
app.use(showProductRouter);
app.use(updateProductRouter);
app.use(deleteProductRouter);

// 404
app.all('*', () => {
    throw new NotFoundError();
});

app.use(errorHandler);

exports.app = app; 