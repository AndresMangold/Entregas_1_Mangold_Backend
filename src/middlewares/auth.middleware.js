module.exports = {
    userisLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        } else {
            return res.redirect('/login'); 
        }
    },

    userIsNotLoggedIn: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return next();
        } else {
            return res.status(401).json({ error: 'User should not be logged in!' });
        }
    },

    userIsAdmin: (req, res, next) => {
        if (req.isAuthenticated() && req.session.user.role === 'admin') {
            return next();
        } else {
            return res.status(403).json({ error: 'Access denied! You should be an Admin' });
        }
    }
};
