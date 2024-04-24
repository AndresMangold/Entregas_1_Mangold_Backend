const { Router } = require('express');
const User = require('../dao/models/user.model');
const { userisLoggedIn, userIsNotLoggedIn } = require('../middlewares/auth.middleware');

const router = Router();

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

router.post('/login', userIsNotLoggedIn, async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(400).json({ error: 'Email o contraseña incorrectas.' });
        }

        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            req.session.user = { email, role: 'admin' };
        } else {
            req.session.user = user; 
            // { email, role: 'user', _id: user._id };
        }

        res.redirect('/api/products');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.post('/register', userIsNotLoggedIn, async (req, res) => {
    const { firstName, lastName, email, age, password } = req.body;

    try {
        const role = email === 'adminCoder@coder.com' ? 'admin' : 'user';

        const user = await User.create({
            firstName,
            lastName,
            age: +age,
            email,
            password,
            role
        });

        res.redirect('/api/products');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/profile', userisLoggedIn, async (req, res) => {
    try {
        const idFromSession = req.session.user._id;

        res.render('profile', {
            title: 'My profile',
            user: req.session.user
        });
    } catch (error) {
        console.error('Error al buscar el usuario en la base de datos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/logout', userisLoggedIn, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
            return res.status(500).send('Error interno del servidor');
        }
        res.redirect('/login');
    });
});

module.exports = router;
