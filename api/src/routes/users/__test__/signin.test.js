const { response } = require('express');
const request = require('supertest');

const {app} = require('../../../app');

const setup = async () => {
    const client = await request(app)
        .post('/api/users/signup')
        .send({
            username: 'jo@doe.com',
            password: 'test',
            name: 'John',
            lastname: 'Doe'
        })
        .expect(201);

    return {client};
};

it('returns 400 with nonexisting username', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            username: 'jo@doe.com',
            password: 'test'
        })
        .expect(400);
});

it('returns 400 with invalid credentials', async () => {
    await setup();

    const response_1 = await request(app)
        .post('/api/users/signin')
        .send({
            username: 'jo@doe.com',
            password: 'test_1'
        })
        .expect(400);

    expect(response_1.get('Set-Cookie')).not.toBeDefined();

    const response_2 = await request(app)
        .post('/api/users/signin')
        .send({
            username: 'jo@doe.com',
            password: ''
        })
        .expect(400);

    expect(response_2.body.errors.length).toEqual(2);
    expect(response_2.body.errors[0].message).toEqual('Please provide a valid password.');

    const response_3 = await request(app)
        .post('/api/users/signin')
        .send({
            username: 'username',
            password: 'test123'
        })
        .expect(400);

    expect(response_3.body.errors[0].message).toEqual('Please provide a valid email.');
});

it('sets a cookie after successful signin', async () => {
    await setup();

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            username: 'jo@doe.com',
            password: 'test'
        })
        .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
});