const mongoose = require('mongoose');

const collection = 'Messages';

const schema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    messages: {
        type: Array,
        required: true,
    }
});

module.exports = mongoose.model(collection, schema, 'messages');