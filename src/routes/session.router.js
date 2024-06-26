const { Router } = require('express');
const User = require('../dao/models/user.model');
const { userisLoggedIn, userIsNotLoggedIn } = require('../middlewares/auth.middleware');
const bcrypt = require('bcrypt');
const passport = require('passport');
const initializePassport = require('../config/passport.config')

const router = Router();

initializePassport();

router.get('/', userIsNotLoggedIn, (req, res) => {
    const isLoggedIn = ![null, undefined].includes(req.session.user);

    res.render('index', {
        title: 'Home',
        style: ['styles.css'],
        isLoggedIn,
        isNotLoggedIn: !isLoggedIn, 
    });
});

router.get('/login', userIsNotLoggedIn, (_, res) => {
    res.render('login', {
        title: 'Login',
        style: ['styles.css'],
    });
});

router.get('/register', userIsNotLoggedIn, (_, res) => { 
    res.render('register', {
        title: 'Register',
        style: ['styles.css'],
    });
});

router.post('/login', userIsNotLoggedIn, (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        if (!user) {
            return res.status(400).json({ error: 'Email o contraseña incorrectas.' });
        }

        req.logIn(user, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            req.session.user = user;
            let welcomeMessage = `¡Bienvenido, ${user.firstName}!`;
            res.redirect(`/api/products?welcome=${encodeURIComponent(welcomeMessage)}`);
        });
    })(req, res, next);
});

router.post('/register', userIsNotLoggedIn, async (req, res) => {
    const { firstName, lastName, email, age, password } = req.body;

    try {
        const hashedPassword = bcrypt.hashSync('adminCod3r123', bcrypt.genSaltSync(10)); 

        const role = email === 'adminCoder@coder.com' ? 'admin' : 'user'; 

        const user = await User.create({
            firstName,
            lastName,
            age: +age,
            email: 'adminCoder@coder.com', 
            password: hashedPassword, 
            role
        });

        req.login(user, err => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error interno del servidor' });
            } else {
                res.redirect('/api/login');
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


router.get('/profile', userisLoggedIn, async (req, res) => {
    try {
        const user = { ...(req.session.user || req.user._doc) };
    
        res.render('profile', {
            title: 'My profile',
            style: ['styles.css'],
            user: user, 
            isLoggedIn: req.isLoggedIn, 

        });
    } catch (error) {
        console.error('Error al buscar el usuario en la base de datos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/logout', userisLoggedIn, (req, res) => {
    req.logout(() => {
        req.session.destroy(() => { 
            res.redirect('/login'); 
        });
    });
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/sessions/githubcallback', passport.authenticate('github',  {
    successRedirect: '/api/products',
    failureRedirect: '/login' 
}));

module.exports = router;