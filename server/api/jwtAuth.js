var jwt = require('jwt-simple');

module.exports = function (req, res, next) {
    var token =  req.headers["x-access-token"];
    if (token) {

        try {
            var decoded = jwt.decode(token, app.get('jwtTokenSecret'));

            if (decoded.exp <= Date.now()) {
                console.log('expired');
                res.status(400).send('Access token has expired').end();
                return;
            }

            req.user = decoded.user;
            return next()


        } catch (err) {
            return next()
        }

    } else {

        next()

    }
};