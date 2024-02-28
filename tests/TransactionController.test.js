const User = require('../src/models/User');
const request = require('supertest');
const index = require('../index');
const mongoose = require('mongoose');
const mongo = require('../src/utils/database');

const user = new User ({
    fullName: 'Pamela Silva',
    cpf: '11111111145',
    email: 'pamela.silva@example.com',
    password: 'password',
    userType: 'USER',
    balance: 1000
});

const merchant = new User ({
    fullName: 'Ricardo Silva',
    cpf: '11111111146',
    email: 'ricardo.silva@example.com',
    password: 'password',
    userType: 'MERCHANT',
    balance: 1000
});

beforeAll(async () => {
    await mongo()
    await mongoose.connection.db.dropCollection('users')
    await user.save();
    await merchant.save();
}, 8000);

 describe('TransactionController.js', () => {

    it('should make a transaction between USER and MERCHANT', async () => {
        const response = await request(index).post('/transaction').send({
            sender: user.cpf,
            receiver: merchant.cpf,
            value: 100
        });
        expect(response.statusCode).toEqual(200)
        expect(response.body).toHaveProperty('message')
    })

 })