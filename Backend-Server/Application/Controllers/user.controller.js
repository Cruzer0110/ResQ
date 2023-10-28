require("dotenv").config({
    path: `${__dirname}/../Server_Config/.env`
});
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../DB_Models");
const User = db.users;

//Create and Save a new User during signup

exports.signup = (req, res) => {
    //Validate request
    if (!(req.body.name && req.body.contact && req.body.password && req.body.confirmPassword)) {
        return res.status(400).send({
            message: "Required fields cannot be empty!"
        });
    }
    else if (!(req.body.password === req.body.confirmPassword)) {
        return res.status(401).send({
            message: "Passwords do not match!"
        });
    }

    //Hash the password
    const saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) {
            return res.status(500).send({
                message: err.message || "Internal server error occured! Please try again later."
            });
        }
        else {
            //Create a User
            const user = new User({
                name: req.body.name,
                contact: req.body.contact,
                password: hash,
                email: req.body.email,
                address: {
                    street: req.body.address.street,
                    city: req.body.address.city,
                    state: req.body.address.state,
                    pin: req.body.address.pin
                },
                role: req.body.role,
                agency: req.body.agency
            });

            //Save User in the database
            user
                .save(user)
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500)
                        .send({
                            message: err.message || "Internal server error occured! Please try again later."
                        });
                });
            return;
        }
    });
};

//Sign in an existing user and return a JWT token corresponding to their role

exports.signin = (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    //Validate request
    if (!(email && password)) {
        return res.status(400).send({
            message: "Required fields cannot be empty!"
        });
    }

    //Find user with corresponding sign in request
    User
        .find({ email: email })
        .then(data => {
            //Return message if no such user found
            if (!data) {
                res.status(404).send({
                    message: "No such email registered! Please signup first!"
                });
                return;
            }
            else {
                // Compare password with the stored password
                bcrypt.compare(password, data[0].password, (err, same) => {
                    if (err) {
                        return res.status(500).send({
                            message: err.message || "Internal server error occured! Please try again later."
                        });
                    } else if (!same) {
                        //Return message for invalid credentials
                        return res.status(401).send({
                            message: "Credentials do not match! Please try again!"
                        });
                    }
                    else {
                        // Create and send a JWT token with appropriate role as response to the user
                        jwt
                            .sign(
                                {
                                    id: data[0].id,
                                    role: data[0].role,
                                    agency: (data[0].role=='agency')?data[0].agency:null
                                },
                                process.env.JWT_SECRET,
                                {
                                    expiresIn: `${process.env.JWT_EXPIRES_IN}d`,
                                    algorithm: "HS256"
                                },
                                (err, token) => {
                                    if (err) {
                                        return res.status(500).send({
                                            message: err.message || "Internal server error occured! Please try again later."
                                        });
                                    }
                                    else {
                                        return res.status(200).send({
                                            message: "Logged in successfully!",
                                            token: token
                                        });
                                    }
                                }
                            );
                    }
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                message: err.message || "Internal server error occured! Please try again later."
            });
        });
};