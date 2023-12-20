const admin = require('../Server_Config/firebase.config.js');

class Middleware {
    decodeToken(req, res, next) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            admin
                .auth().verifyIdToken(token)
                .then(validToken => {
                    return next();
                }, invalidToken => {
                    return res.status(401).send({
                        message: 'Invalid token',
                        token: token
                    });
                });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Server error. Please try again later.'
            });
        }
    };
    decodeTokenForSocket(token) {
        try {
            admin
                .auth()
                .verifyIdToken(token)
                .then(validToken => {
                    return {
                        isValid: true,
                        uid: validToken.uid
                    };
                }, invalidToken => {
                    return {
                        isValid: false,
                        uid: null
                    }
                });
        } catch (err) {
            console.log(err);
            return false;
        }
    }
};

module.exports = new Middleware();