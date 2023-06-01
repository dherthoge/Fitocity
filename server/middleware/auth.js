module.exports = {
    // redirects users to the login page if they are not authenticated
    ensureAuth: (req, res, next) => {
        if (req.isAuthenticated())
            return next();
        else
            res.redirect('/');
    },
    // redirects users to the login page if they are authenticated and
    // try to access a url for guests
    ensureGuest: (req, res, next) => {
        if (req.isAuthenticated())
            res.redirect('/dashboard');
        else
            return next();
    }
}