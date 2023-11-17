const admin = require('../Server_Config/firebase.config.js');

class Middleware{
    /**
     * Decodes the authorization token extracted from the request headers.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
    decodeToken(req,res,next){
        /**
         * The authorization token extracted from the request headers.
         * @type {string}
         */
        const token = req.headers.authorization.split(' ')[1];
        admin
            .auth().verifyIdToken(token)
            .then(decodeValue => {
                if (decodeValue) {
                    console.log(decodeValue);
                    return next();
                } else {
                    return res.status(401).send({
                        message: 'Invalid token'
                    });
                }
            }, err => {
                res.status(500).send({
                    message: 'Server error. Please try again later.'
                });
            });
    };
};

module.exports = new Middleware();