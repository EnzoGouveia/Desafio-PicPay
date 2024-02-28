const mongoose = require("mongoose")

const db = async () => {
    if(!global.mongoose) {
        mongoose.set('strictQuery', false)
        global.mongoose = await mongoose.connect(process.env.MONGODB_URL)
        console.log('Conectado ao banco')
    }
}
module.exports =  db