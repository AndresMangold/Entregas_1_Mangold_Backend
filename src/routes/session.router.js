const { Router } = require('express');
const User = require('../dao/models/user.model');

const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar si el usuario existe en la base de datos
        const user = await User.findOne({ email, password });

        if (!user) {
            // Si el usuario no existe, redirigir al usuario a la página de registro
            return res.redirect('/register');
        }

        // Verificar si el usuario es administrador
        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            // Si es administrador, asignar el rol "admin"
            req.session.user = { email, role: 'admin' };
        } else {
            // Si no es administrador, asignar el rol "user"
            req.session.user = { email, role: 'user' };
        }

        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(400).send('Error in login!');
    }
});

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, age, password } = req.body;

    try {
        // Todos los usuarios, excepto los administradores, tendrán el rol "user" por defecto
        const role = email === 'adminCoder@coder.com' ? 'admin' : 'user';

        // Crear el usuario con el rol correspondiente
        const user = await User.create({
            firstName,
            lastName,
            age: +age,
            email,
            password,
            role
        });

        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(400).send('Error creating user!');
    }
});

router.get('/logout', (req, res) => {
    // Destruir la sesión
    req.session.destroy(err => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
            return res.status(500).send('Error interno del servidor');
        }
        // Redirigir al usuario a la vista de login después de cerrar sesión
        res.redirect('/login');
    });
});


module.exports = router;
