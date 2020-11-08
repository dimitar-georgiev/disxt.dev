const errorHandler = (err, req, res, next) => {
    if (err) {
        // return res.status(err.statusCode).send({errors: {message: err.message}});
        return res.status(err.statusCode).send({errors: err.serializeErrors()});
    }

    res.status(500).send({errors: [{message: 'Something went wrong.'}]}); 
};

exports.errorHandler = errorHandler;