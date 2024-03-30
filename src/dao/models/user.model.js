const { default: mongoose } = require("mongoose")

const { Schema } = require('mongoose')

const colecction = 'users'

const schema = new mongoose.Schema({
    firstName: String,

    lastname: String,

    email: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model(colecction, schema)