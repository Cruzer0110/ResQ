/*
    This file contains all the methods that will be used to handle the requests for the location log collection of the database.
*/

const db = require("../DB_Models");
const LocationLog = db.locationLogs;

// Create and save new log
exports.create = (req, res) => {
    // Validate request
    if (!req.body.userID) {
        return res.status(400).send({
            message: "User ID cannot be empty!"
        });
    }

    // Create a log
    const locationLog = new LocationLog({
        userID: req.body.userID,
        location: {
            type: req.body.location.type,
            coordinates: req.body.location.coordinates
        },
        timestamp: Date.now()
    });

    // Save log in the database
    locationLog
        .save(locationLog)
        .then(data => {
            res.send(data);
        }, err => {
            res.status(500).send({
                message: "Internal Server Error!"
            });
            console.log(err);
        });
};

// Retrieve logs of a user from database
exports.getByID = (req,res) => {
    const id = req.params.id;

    LocationLog
        .find({userID: id})
        .sort({timestamp: -1})
        .limit(5)
        .then(data => {
            res.status(200).send(data);
        },
        err => {
            res.status(500).send({
                message: "Internal Server Error!"
            });
            console.log(err);
        });
};