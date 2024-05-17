const passport = require("passport");
const { Strategy } = require('passport-local');
const User = require('../dao/models/user.model');
const { isValidPassword, hashPassword } = require("../utils/hashing");

const initializePassport = () => {
    passport.use('login', new Strategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async function(email, password, done) {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return done(null, false, { message: 'Email o contraseña incorrectas.' });
                }
                if (!isValidPassword(password, user.password)) {
                    return done(null, false, { message: 'Email o contraseña incorrectas.' });
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));

    passport.use('register', new Strategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { firstName, lastName, email, age } = req.body;
            try {
                const user = await User.findOne({ email: username });
                if (user || username === 'adminCoder@coder.com') {
                    console.log('El usuario ya existe.');
                    return done(null, false);
                } else {
                    const newUser = {
                        firstName,
                        lastName,
                        email,
                        age: +age,
                        password: hashPassword(password) 
                    }
                    const result = await User.create(newUser);
                    return done(null, result);
                }
            } catch (err) {
                done(err);
            }
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(async function(id, done) {
        try {
            const user = await User.findById(id);
            done(null, user)
        } catch (err) {
            done(err);
        }
    });
}

module.exports = initializePassport;
