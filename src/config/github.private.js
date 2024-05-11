require('dotenv').config();

module.exports = {
    appId: process.env.appId,
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.callbackURL
}
