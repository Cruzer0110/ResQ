/*
    This file contains the methods that will be used to handle the requests made to the server 
*/

const db = require("../DB_Models");
const Agency = db.agencies;

// Create and Save a new Agency
exports.create = (req, res) => {
    //Validate request
    if (!req.body.name) {
        res.status(400).send({ 
            message: 'Enter a value in "Name" field!' 
        });
        return;
    };

    //Create an Agency
    const agency = new Agency({
        name: req.body.name,
        type: req.body.type,
        contact: req.body.contact,
        expertise: req.body.expertise,
        address: {
            street: req.body.address.street,
            city: req.body.address.city,
            state: req.body.address.state,
            pin: req.body.address.pin
        },
        location: {
            type: req.body.location.type,
            coordinates: req.body.location.coordinates
        }
    });

    //Save Agency in the database
    agency
        .save(agency)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while creating the Agency."
            });
        });
};


// Retrieve all Agencies from the database
exports.getAll = (req, res) => {
    let condition = {};

    Agency.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500)
                .send({
                    message: err.message || "Some error occured while retrieving Agencies."
                });
        });
};

// Retrieve all Agencies from the database in the given location
exports.getAllByLocation = (req, res) => {
    /* 
        Code for this method yet to be written
        Currently, the way filter out location is not known...
        
    */
};

// Find an Agency with the given ID
exports.getOne = (req, res) => {
    const id = req.params.id;

    Agency.findById(id)
        .then(data => {
            if (!data)
                res.status(404)
                    .send({
                        message: "Agency with id = " + id + " not found!"
                    });
            else res.status(200).send(data);
        })
        .catch(err => {
            res.status(500)
                .send({
                    message: err.message || "Error retrieving Agency with id = " + id
                });
        });
};


// Update an Agency by the ID in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400)
            .send({
                message: "Empty data to update!"
            });
    }

    const id = req.params.id;

    Agency.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404)
                    .send({
                        message: `Cannot update Agency with id = ${id}. Agency was not found!`
                    });
            }
            else {
                res.send({
                    message: "Agency was successfully updated!"
                });
            }
        })
        .catch(err => {
            res.status(500)
                .send({
                    message: err.message || "Error updating Agency with id = " + id
                });
        });
};


// Delete an Agency with the specified ID in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Agency.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404)
                    .send({
                        message: `Cannot delete Agency with id = ${id}. Agency was not found!`
                    });
            }
            else {
                res.send({
                    message: "Agency was successfully deleted!"
                });
            }
        })
        .catch(err => {
            res.status(500)
                .send({
                    message: err.message || "Could not delete agency with id = " + id
                });
        });
};


// Purge database
exports.deleteAll = (req, res) => {
    Agency.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} agencies were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500)
                .send({
                    message: err.message || "Some error occured while removing all agencies."
                });
        });
};


// Find all Agencies with the given type
exports.findType = (req, res) => {
    const type = req.params.type;
    let condition = type ? { type: { $regex: new RegExp(type), $options: "i" } } : {};

    Agency.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500)
                .send({
                    message: err.message || "Some error occured while retrieving Agencies."
                });
        });
};