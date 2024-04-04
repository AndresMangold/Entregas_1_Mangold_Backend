const mongoose = require('mongoose');

const collection = 'allMessages';

const schema = new mongoose.Schema({
    messages: [
        {
            user: {
                type: String,
                required: true
            },
            message: {
                type: String,
                required: true
            }
        }
    ]
});

module.exports = mongoose.model(collection, schema, 'messages');