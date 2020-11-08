const mongoose = require('mongoose');
const request = require('supertest');

const {app} = require('../../../app');

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

it('returns 401 if user is not logged in', async () => {
    const {product} = await setup();
    
    await request(app)
        .put(`/api/products/${product._id}`)
        .send({})
        .expect(401);
});

it('returns 403 if user is logged in but not admin', async () => {
    const {client, product} = await setup();

    await request(app)
        .put(`/api/products/${product._id}`)
        .set('Cookie', client.get('Set-Cookie'))
        .send({})
        .expect(403);
});

it('returns 404 if user is logged in as admin but invalid product id is provided', async () => {
    const {admin} = await setup();

    await request(app)
        .put(`/api/products/${mongoose.Types.ObjectId().toHexString()}`)
        .set('Cookie', admin.get('Set-Cookie'))
        .send({
            name: 'Test Product',
            price: 75,
            description: 'Test Description'  
        })
        .expect(404);
});

it('returns 400 if user is logged as admin but invalid data is provided', async () => {
    const {admin, product} = await setup();

    const response = await request(app)
        .put(`/api/products/${product._id}`)
        .set('Cookie', admin.get('Set-Cookie'))
        .send({
            name: 'Test Product',
            description: 'Test Description'  
        })
        .expect(400);

    expect(response.body.errors.length).toEqual(1);
    expect(response.body.errors[0].field).toEqual('price');
});

it('returns 200 if user is logged in as admin and valid product id is provided', async () => {
    const {admin, product} = await setup();

    const response = await request(app)
        .put(`/api/products/${product._id}`)
        .set('Cookie', admin.get('Set-Cookie'))
        .send({
            name: 'Test Product',
            price: 75,
            description: 'Test Description'  
        })
        .expect(200);

    expect(response.body.price).toEqual(75);
});