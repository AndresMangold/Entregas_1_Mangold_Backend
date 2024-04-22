const { Router } = require('express')
const User = require('../dao/models/user.model')
const { userisLoggedIn, userIsNotLoggedIn } = require('../middlewares/auth.middleware')

const router = Router()

router.get('/', (req, res) => {
    const isLoggedIn = ![null, undefined].includes(req.session.user)

    res.render('index', {
        title: 'Home',
        isLoggedIn,
        isNotLoggedIn: !isLoggedIn,
    })
})

router.get('/login', userIsNotLoggedIn, (_, res) => {
    res.render('login', {
        title: 'Login'
    })
})

router.get('/register', userIsNotLoggedIn, (_, res) => {
    res.render('register', {
        title: 'Register'
    })
})

router.get('/profile', userisLoggedIn, async (req, res) => {
    try {
        const idFromSession = req.session.user._id;
        // Corrige la consulta para buscar el usuario en la base de datos
        const user = await User.findOne({ _id: idFromSession });

        // Renderiza la plantilla 'profile' con los datos del usuario encontrado en la base de datos
        res.render('profile', {
            title: 'My profile',
            user: user // Aquí debes pasar el usuario encontrado en la base de datos
        });
    } catch (error) {
        console.error('Error al buscar el usuario en la base de datos:', error);
        // Maneja el error adecuadamente, por ejemplo, redirigiendo a una página de error o mostrando un mensaje de error al usuario
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router