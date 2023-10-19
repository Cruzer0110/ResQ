const bcrypt = require("bcrypt");
const db = require("../DB_Models");
const User = db.users;

//Create and Save a new User during signup

exports.signup = (req, res) => {
    //Validate request
    if (!(req.body.name && req.body.contact && req.body.password)) {
        return res.status(400).send({
            message: "Required fields cannot be empty!"
        })
    }

    //Hash the password
    const saltRounds = 10;
    bcrypt.hash(req.body.password,saltRounds,(err,hash) => {
        if (err) {
            return res.status(500).send({
                message: err.message || "Some error occured while hashing the password."
            });
        }

        //Create a User
        const user = new User({
            name: req.body.name,
            contact: req.body.contact,
            password: hash,
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
                        message: err.message || "Some error occured while creating the User."
                    });
            });
    });
};