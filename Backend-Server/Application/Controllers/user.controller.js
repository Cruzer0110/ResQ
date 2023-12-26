const db = require("../DB_Models");
const User = db.users;

/**
 * TODO: Log all errors to a log file
 */

/**
 * Create and save a new user in the database if it does not exist already
 * 
 * @param {import('express').Request} req : The request object
 * @param {import('express').Response} res : The response object
 * @param {import('express').NextFunction} next : The next middleware function in the queue
 */
exports.autoCreateUser = (req, res, next) => {

    // Check if User ID is present in request
    if (!req.body.userID) {
        return res.status(401).send({
            message: "No user ID present in request"
        });
    }

    // Check if user exists in database
    User
        .findOne({
            firebaseID: req.body.userID
        })
        .then(user => {

            // If user alady exists, move on to next middleware
            if (user) {
                return next();
            }

            // If user does not exist, create a new user
            else {

                // Check if agency field is present for agency users
                if (req.body.role === 'agency' && !req.body.agency) {
                    return res.status(400).json({
                        error: 'Agency field is required for the agency role.'
                    });
                }

                try {
                    const user = new User({
                        firebaseID: req.body.userID,
                        name: req.body.name,
                        contact: req.body.contact,
                        email: req.body.email,
                        address: {
                            street: req.body.address.street,
                            city: req.body.address.city,
                            state: req.body.address.state,
                            pin: req.body.address.pin
                        },
                        role: req.body.role,
                        agency: req.body.agency ? req.body.agency : null
                    });

                    // Save user in the database
                    user
                        .save()
                        .then(data => {
                            next();
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: "Some error occurred while creating the User."
                            });
                        });
                } catch (error) {
                    res.status(400).json({
                        error: "Please provide all details"
                    })
                }
            }
        })
};

/**
 * @description
 * Create and save a new user in the database
 * 
 * @param {import('express').Request} req : The request object
 * @param {import('express').Response} res : The response object
 */
exports.createUser = (req, res) => {
    // Check if agency field is present for agency users
    if (req.body.role === 'agency' && !req.body.agency) {
        return res.status(400).json({
            error: 'Agency field is required for the agency role.'
        });
    }

    try {
        const user = new User({
            firebaseID: req.body.userID,
            name: req.body.name,
            contact: req.body.contact,
            email: req.body.email,
            address: {
                street: req.body.address.street,
                city: req.body.address.city,
                state: req.body.address.state,
                pin: req.body.address.pin
            },
            role: req.body.role,
            agency: req.body.agency ? req.body.agency : null
        });

        // Save user in the database
        user
            .save()
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: "Some error occurred while creating the User."
                });
            });
    } catch (error) {
        res.status(400).json({
            error: "Please provide all details"
        })
    }
}

/**
 * Retrieve and return information of the currently logged in user from the database.
 * 
 * @param {import('express').Request} req : The request object
 * @param {import('express').Response} res : The response object
 */
exports.getSelfUser = (req, res) => {
    User
        .findOne({
            firebaseID: req.body.userID
        })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.body.userID
                });
            }
            res.status(200).send(user);
        })
        .catch(err => {
            return res.status(500).send({
                message: "Error retrieving user with id " + req.body.userID
            });
        });
}

/**
 * Retrieve and return information of an user from the database.
 * @param {import('express').Request} req : The request object
 * @param {import('express').Response} res : The response object
 */
exports.getUser = (req, res) => {
    const userID = req.params.id;
    User
        .findOne({
            id: userID
        })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + userID
                });
            }
            res.status(200).send(user);
        })
        .catch(err => {
            return res.status(500).send({
                message: "Error retrieving user with id " + userID
            });
        });

}

/**
 * Update and return information of the currently logged in user from the database.
 * @param {import('express').Request} req : The request object
 * @param {import('express').Response} res : The response object
 */
exports.updateSelfUser = (req, res) => {
    User
        .findOneAndUpdate({
            firebaseID: req.body.userID
        }, req.body, {
            new: true
        })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.body.userID
                });
            }
            res.status(200).send(user);
        })
        .catch(err => {
            return res.status(500).send({
                message: "Error updating user with id " + req.body.userID
            });
        });
}

/**
 * 
 * @param {import('express').Request} req : The request object
 * @param {import('express').Response} res : The response object
 */
exports.updateUser = (req, res) => {
    User
        .findOneAndUpdate({
            id: req.params.id
        }, req.body, {
            new: true
        })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            res.status(200).send(user);
        })
        .catch(err => {
            return res.status(500).send({
                message: "Error updating user with id " + req.params.id
            });
        });

}

/**
 * Delete an user from the database.
 * 
 * @param {import('express').Request} req : The request object
 * @param {import('express').Response} res : The response object
 */
exports.deleteUser = (req, res) => {
    User
        .findOneAndDelete({
            id: req.params.id
        })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            res.status(200).send({
                message: "User deleted successfully"
            });
        })
        .catch(err => {
            return res.status(500).send({
                message: "Error deleting user with id " + req.params.id
            });
        });
}

/**
 * This function deletes all users from the database
 * @param {import('express').Request} req : The request object
 * @param {import('express').Response} res : The response object
 */
exports.deleteAllUsers = (req, res) => {
    User
        .deleteMany({})
        .then(data => {
            res.status(200).send({
                message: `${data.deletedCount} users deleted successfully`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: "Some error occurred while deleting all users."
            });
        });
}

/**
 * Function to get all users from the database
 * @param {import('express').Request} req : The request object
 * @param {import('express').Response} res : The response object
 */
exports.getAllUsers = (req, res) => {
    User
        .find()
        .sort({
            name: 1
        })
        .then(users => {
            if (!users) {
                return res.status(404).send({
                    message: "No users found"
                });
            }
            res.status(200).send(users);
        })
        .catch(err => {
            return res.status(500).send({
                message: "Error retrieving users"
            });
        });
}

/**
 * Function to retrieve all users of a particular agency
 * @param {import('express').Request} req : The request object
 * @param {import('express').Response} res : The response object
 */
exports.getAgencyUsers = (req, res) => {
    User
        .find({
            agency: req.body.agency
        })
        .sort({
            name: 1
        })
        .then(users => {
            if (!users) {
                return res.status(404).send({
                    message: "No users present in the agency"
                });
            }
            res.status(200).send(users);
        })
        .catch(err => {
            return res.status(500).send({
                message: "Error retrieving users"
            });
        });
}