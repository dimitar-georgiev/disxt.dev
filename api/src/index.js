const mongoose = require('mongoose');

const {app} = require('./app');

const startDB = async () => {
    const {MONGO_URI} = process.env;

    if (!MONGO_URI) {
        throw new Error('Missing Mongo Uri.');
    }

    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('Connected to MongoDB.');
    }
    catch (err) {
        console.log('DB Connection Error: ', err);
        return;
    }

    app.listen(3000, () => console.log('Server listening on port 3000.'));
};

startDB();