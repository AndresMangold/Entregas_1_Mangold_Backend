const passport = require('passport');
const { Strategy } = require('passport-local');
const User = require('../dao/models/user.model'); 
const { isValidPassword, hashPassword } = require("../utils/hashing");
const Cart = require('../dao/models/cart.model');

const initializePassport = () => {
    passport.use('login', new Strategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async function(email, password, done) {
            try {
                const user = await User.findOne({ email }).populate('cartId');
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
                if (user) {
                    console.log('El usuario ya existe.');
                    return done(null, false);
                } else {
                    const newCart = await Cart.create({ products: [] });
    
                    const newUser = {
                        firstName,
                        lastName,
                        email,
                        age: +age,
                        password: hashPassword(password),
                        role: 'user',
                        cartId: newCart._id 
                    }
                    const result = await User.create(newUser);
                    return done(null, result);
                }
            } catch (err) {
                done(err);
            }
        }
    ));
    
    

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id).populate('cartId');
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
}

module.exports = initializePassport;
