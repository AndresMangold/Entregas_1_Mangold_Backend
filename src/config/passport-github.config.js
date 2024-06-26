const passport = require('passport');
const { Strategy } = require('passport-github2');
const { clientID, clientSecret, callbackURL } = require('./github.private');
const Users = require('../dao/models/user.model') 

const initializeStrategy = () => {
    passport.use('github', new Strategy({
        clientID,
        clientSecret,
        callbackURL
    }, async (_accessToken, _refreshToker, profile, done) => {
        try {
            console.log('profile, github: ', profile, profile._json)

            const user = await Users.findOne({ email: profile._json.email })
            if (user) {
                return done(null, user)
            }

            const fullName = profile._json.name
            const firstName = fullName.substring(0, fullName.lastIndexOf(' '))
            const lastName = fullName.substring(fullName.lastIndexOf(' ') + 1)
            const newUser = {
                firstName,
                lastName,
                age: 30,
                email: profile._json.email,
                password: ''
            }
            const result = await Users.create(newUser)
            done(null, result)
        }
        catch (err) {
            done(err)
        }
    }));

    passport.serializeUser((user, done) => {
        console.log('Serailized: ', user);
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        console.log('Deserialized: ', id)
        const user = await Users.findById(id);
        done(null, user)
    });
};

module.exports = initializeStrategy;
