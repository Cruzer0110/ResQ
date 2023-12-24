const admin = require('../Server_Config/firebase.config.js');

class Middleware {

    /**
     * @description Middleware to verify the token in HTTPS requests.
     * This middleware is invoked before all the HTTPS requests.
     * 
     * @param {import('express').Request} req : Request object
     * @param {import('express').Response} res : Response object
     * @param {import('express').NextFunction} next : Next middleware function
     */
    decodeToken(req, res, next) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            admin
                .auth().verifyIdToken(token)
                .then(validToken => {
                    req.body.userID = validToken.uid;
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

    /**
     * @description Middleware to verify the token in socket connections.
     * @param {string} token : The JWT in socket connections to be verified
     * @returns {object} : Returns an object with the validity of the token and the uid of the user
     */
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