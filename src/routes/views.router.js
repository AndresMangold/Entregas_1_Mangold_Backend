const { Router } = require('express');
const User = require('../dao/models/user.model');
const { userisLoggedIn, userIsNotLoggedIn } = require('../middlewares/auth.middleware');

const router = Router();

router.get('/', (req, res) => {
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

router.get('/register', (_, res) => { 
    res.render('register', {
        title: 'Register',
        style: ['styles.css'],
    });
});


router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
            return res.status(500).send('Error interno del servidor');
        }
        res.redirect('/login');
    });
});

module.exports = router;