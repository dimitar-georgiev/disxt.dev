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
};



it('returns 401 if user is not logged in', async () => {
    const response = await request(app)
        .get('/api/products')
        .send({})
        .expect(401);
});

it('hides created_by field if user is logged in but not admin', async () => {
    const {client} = await setup();

    const response = await request(app)
        .get('/api/products')
        .set('Cookie', client.get('Set-Cookie'))
        .send({})
        .expect(200);

    expect(response.body[0].created_by).not.toBeDefined();
});

it('shows created_by field if user is logged in as admin', async () => {
    const {admin} = await setup();

    const response = await request(app)
    .get('/api/products')
    .set('Cookie', admin.get('Set-Cookie'))
    .send({})
    .expect(200);

    expect(response.body[0].created_by).toBeDefined();
    expect(response.body[0].created_by).toEqual(admin.body._id);
});