const admin = require('../Server_Config/firebase.config.js');

class Middleware {
    decodeToken(req, res, next) {
        const token = req.headers.authorization.split(' ')[1];
        admin
            .auth().verifyIdToken(token)
            .then(decodeValue => {
                return next();
            }, invalidToken => {
                return res.status(401).send({
                    message: 'Invalid token',
                    token: token
                });
            })
            .catch(error => {
                res.status(500).send({
                    message: 'Server error. Please try again later.'
                });
            });
    };
};

module.exports = new Middleware();