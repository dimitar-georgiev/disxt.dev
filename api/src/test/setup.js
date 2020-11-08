const mongoServer = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongo;

beforeAll(async () => {
    process.env.JWT_KEY = '123';

    mongo = new mongoServer.MongoMemoryServer();

    const mongoURI = await mongo.getUri();

    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    }
    catch (err) {
        console.log(err);
    }
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});