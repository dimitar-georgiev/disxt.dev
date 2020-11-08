const request = require('supertest');

const {app} = require('../../../app');

it('clears the cookie after signout', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            username: 'jo@doe.com',
            password: 'test',
            name: 'John',
            lastname: 'Doe'
        })
        .expect(201);

    const response = await request(app)
        .post('/api/users/signout')
        .send({})
        .expect(200);

    expect(response.get('Set-Cookie')[0]).toEqual('express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly');
});