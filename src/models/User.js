const mongoose = require('mongoose')

const User = mongoose.model('User', {
    fullName: String,
    cpf: String,
    email: String,
    password: String,
    userType: String,
    balance: Number
})

module.exports = User