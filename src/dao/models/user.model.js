const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    role: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
})

module.exports = mongoose.model('Users', schema, 'users')