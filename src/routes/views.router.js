const { Router } = require('express');
const User = require('../dao/models/user.model');
const { userisLoggedIn, userIsNotLoggedIn } = require('../middlewares/auth.middleware');

const router = Router();

router.get('/', (req, res) => {
    const isLoggedIn = ![null, undefined].includes(req.session.user);

    res.render('index', {
        title: 'Home',
        isLoggedIn,
        isNotLoggedIn: !isLoggedIn, 
    });
});

router.get('/login', userIsNotLoggedIn, (_, res) => {
    res.render('login', {
        title: 'Login'
    });
});

router.get('/register', (_, res) => { 
    res.render('register', {
        title: 'Register'
    });
});

router.get('/profile', userisLoggedIn, async (req, res) => {
    try {
        const idFromSession = req.session.user._id;
        const user = await User.findOne({ _id: idFromSession });

        res.render('profile', {
            title: 'My profile',
            user: user
        });
    } catch (error) {
        console.error('Error al buscar el usuario en la base de datos:', error);
        res.status(500).send('Error interno del servidor');
    }
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
