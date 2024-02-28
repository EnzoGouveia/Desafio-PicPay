const express = require('express');
const app = express();
const db = require('./src/utils/database');

const UserRoute = require('./src/routes/user');
const TransactionRoute = require('./src/routes/transaction');

app.use(express.json());


app.listen(process.env.PORT, async () => {
    await db()
    console.log('app listening on port 3000')
})

app.use('/', UserRoute)
app.use('/', TransactionRoute)

module.exports = app;