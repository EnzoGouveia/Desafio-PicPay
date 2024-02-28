const User = require('../src/models/User');
const request = require('supertest');
const index = require('../index');
const mongoose = require('mongoose');
const mongo = require('../src/utils/database');

const userOne = new User ({
    fullName: 'Leandro Silva',
    cpf: '11111111145',
    email: 'leandro.silva@example.com',
    password: 'password',
    userType: 'MERCHANT',
    balance: 100
});

beforeAll(async () => {
    await mongo()
    await mongoose.connection.db.dropCollection('users')
    await userOne.save();
});

describe('UserController.js', () => {

    it('should create user in database', async () => {
        const response = await request(index).post('/user/register').send({
            fullName: 'Caio Castro',
            email: 'caio.castro@example.com',
            cpf: '11111111143',
            password: 'password',
            userType: 'USER',
            balance: 50
        });
        expect(response.statusCode).toEqual(201)
        expect(response.body).toHaveProperty('message')
    })

    it('should get all users from database', async () => {
        const response = await request(index).get('/users').send();
        expect(response.statusCode).toEqual(200)
        expect(response.body).not.toBeNull()
    })

    it('should find from database', async () => {
        const response = await request(index).post('/user/find').send({
            cpf: userOne.cpf,
        });
        expect(response.statusCode).toEqual(200)
        expect(response.body.email).toEqual('leandro.silva@example.com')
    })

    it('should update from database', async () => {
        const response = await request(index).post('/user/update').send({
            cpf: userOne.cpf,
            fullName: 'Leandro Castro Silva'
        });
        expect(response.statusCode).toEqual(200)
        expect(response.body).toHaveProperty('message')
    })

    it('should delete user from database', async () => {
        const response = await request(index).delete('/user/delete').send({
            cpf: userOne.cpf
        });
        expect(response.statusCode).toEqual(200)
        expect(response.body).toHaveProperty('message')
    })
})