const request = require('supertest');

const {app} = require('../../../app');

it('returns 201 on successful signup', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            username: 'jo@doe.com',
            password: 'test',
            name: 'John',
            lastname: 'Doe'
        })
        .expect(201);
});

it('returns 400 with invalid username', async () => {

});

it('returns 400 with invalid password', async () => {

});

it('returns 400 with missing username/password', async () => {

});

it('rejects duplicate usernames', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            username: 'jo@doe.com',
            password: 'test',
            name: 'John',
            lastname: 'Doe'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({
            username: 'jo@doe.com',
            password: 'test',
            name: 'John',
            lastname: 'Doe'
        })
        .expect(400);
});

it('sets a cookie after successful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            username: 'jo@doe.com',
            password: 'test',
            name: 'John',
            lastname: 'Doe'
        })
        .expect(201);
    
    expect(response.get('Set-Cookie')).toBeDefined();
});