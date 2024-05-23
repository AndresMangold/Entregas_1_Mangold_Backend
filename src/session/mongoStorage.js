const session = require('express-session');
const defaultOptions = require('./defaultOptions');
const MongoStore = require('connect-mongo');
const { dbName, mongoUrl } = require('../dbConfig');

const storage = MongoStore.create({
    dbName,
    mongoUrl,
    ttl: 900
})

module.exports = session({
    store: storage,
    ...defaultOptions
})