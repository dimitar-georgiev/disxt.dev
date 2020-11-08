const mongoose = require('mongoose');
const request = require('supertest');

const {app} = require('../../../app');
const {Product} = require('../../../models/product');

const setup = async () => {
    const admin = await request(app)
        .post('/api/users/signup')
        .send({
            username: "jo@doe.com",
            password: "test",
            name: "John",
            lastname: "Doe",
            role: 'admin'
        })
        .expect(201);

    const client = await request(app)
        .post('/api/users/signup')
        .send({
            username: "jo-client@doe.com",
            password: "test",
            name: "John",
            lastname: "Doe"
        })
        .expect(201); 

    const product = await request(app)
        .post('/api/products')
        .set('Cookie', admin.get('Set-Cookie'))
        .send({
            name: 'Test Product',
            price: 7,
            description: 'Test Description'  
        })
        .expect(201);

    return {admin, client, product: product.body};
}

it('returns 401 if user not logged in', async () => {
    const {product} = await setup();

    await request(app)
        .get(`/api/products/${product._id}`)
        .send({})
        .expect(401);
});

it('returns 404 if user logged in but invalid product id is provided', async () => {
    const {admin} = await setup();

    await request(app)
        .get(`/api/products/${mongoose.Types.ObjectId().toHexString()}`)
        .set('Cookie', admin.get('Set-Cookie'))
        .send({})
        .expect(404);
});

it('hides created_by if user is logged in and not admin', async () => {
    const {client, product} = await setup();

    const response = await request(app)
        .get(`/api/products/${product._id}`)
        .set('Cookie', client.get('Set-Cookie'))
        .send({})
        .expect(200);

    expect(response.body.created_by).not.toBeDefined();
});

it('shows created_by if admin user', async () => {
    const {admin, product} = await setup();

    const response = await request(app)
        .get(`/api/products/${product._id}`)
        .set('Cookie', admin.get('Set-Cookie'))
        .send({})
        .expect(200);

    expect(response.body.created_by).toBeDefined();
    expect(response.body.created_by).toEqual(product.created_by);
});