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

    return {admin, client};
}

it('returns 401 if user not logged in', async () => {
    await request(app)
        .post('/api/products')
        .send({})
        .expect(401); 
});

it('returns 403 if user logged in but not admin', async () => {
    const {client} = await setup();

    await request(app)
        .post('/api/products')
        .set('Cookie', client.get('Set-Cookie'))
        .send({
            name: 'Test Product',
            price: 7,
            description: 'Test Description'    
        })
        .expect(403); 
});

it('returns 400 if user is logged in as admin and invalid data is provided', async () => {
    const {admin} = await setup();

    const response = await request(app)
        .post('/api/products')
        .set('Cookie', admin.get('Set-Cookie'))
        .send({
            description: 'Test Description'
        })
        .expect(400);

    expect(response.body.errors.length).toEqual(2);
    expect(response.body.errors[0].field).toEqual('name');
    expect(response.body.errors[1].field).toEqual('price');
});

it('returns 201 if user is logged in as admin and valid data is provided', async () => {
    const {admin} = await setup();

    const productResponse = await request(app)
        .post('/api/products')
        .set('Cookie', admin.get('Set-Cookie'))
        .send({
            name: 'Test Product',
            price: 7,
            description: 'Test Description'
        })
        .expect(201);

    expect(productResponse.body.created_by).toEqual(admin.body._id);
});