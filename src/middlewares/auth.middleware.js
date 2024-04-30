module.exports = {
    userisLoggedIn: (req, res, next) => {
        const isLoggedIn = ![null, undefined].includes(req.session.user);
        if (!isLoggedIn) {
            return res.redirect('/login'); 
        }
        next();
    },

    userIsNotLoggedIn: (req, res, next) => {
        const isLoggedIn = ![null, undefined].includes(req.session.user);
        if (isLoggedIn) {
            return res.status(401).json({ error: 'User should not be logged in!' });
        }
        next();
    },

    userIsAdmin: (req, res, next) => {
        const isLoggedIn = ![null, undefined].includes(req.session.user);
        const isAdmin = isLoggedIn && req.session.user.role === 'admin';
        if (!isAdmin) {
            return res.status(403).json({ error: 'Access denied! You should be an Admin' });
        }
        next();
    }
};