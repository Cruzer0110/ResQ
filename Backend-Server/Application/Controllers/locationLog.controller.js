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
        .save()
        .then(data => {
            res.send(data);
        }, err => {
            res.status(500).send({
                message: "Internal Server Error!"
            });
        });
};

// Retrieve logs of a user from database for generating current location
exports.getByID = (req, res) => {
    const id = req.params.id;

    LocationLog
        .find({ userID: id })
        .sort({ timestamp: -1 })
        .limit(1)
        .then(data => {
            res.status(200).send(data);
        },
            err => {
                res.status(500).send({
                    message: "Internal Server Error!"
                });
            });
};

// Retrieve logs of a user from database to generate location history

exports.getHistory = (req, res) => {
    const id = req.params.id;

    LocationLog
        .find({ userID: id })
        .sort({ timestamp: -1 })
        .then(data => {
            res.status(200).send(data);
        },
            err => {
                res.status(500).send({
                    message: "Internal Server Error!"
                });
            });
}

// Retrieve logs of all users from database to generate heat map data

exports.getAll = (req, res) => {
    LocationLog
        .find()
        .sort({ timestamp: -1 })
        .then(data => {
            res.status(200).send(data);
        },
            err => {
                res.status(500).send({
                    message: "Internal Server Error!"
                });
            });
}

// Retrieve location data in a certain radius for agencies to see events in their area

exports.getRadius = (req, res) => {
    const lat = req.params.lat;
    const long = req.params.long;
    const radius = req.params.radius;

    LocationLog
        .find({
            location: {
                $near: {
                    $maxDistance: radius,
                    $geometry: {
                        type: "Point",
                        coordinates: [long, lat]
                    }
                }
            }
        })
        .then(data => {
            res.status(200).send(data);
        },
            err => {
                res.status(500).send({
                    message: "Internal Server Error!"
                });
            });
}

// Update a log identified by the logID in the request

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update cannot be empty!"
        });
    }

    const id = req.params.id;

    LocationLog
        .findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    message: "Cannot update log with id=" + id + ". Log not found!"
                });
            } else res.send({ message: "Log was updated successfully." });
        }, err => {
            res.status(500).send({
                message: "Internal Server Error!"
            });
        });
}

// Delete all logs of an user with the specified logID in the request

exports.deleteAll = (req, res) => {
    const id = req.params.id;

    LocationLog
        .deleteMany({ userID: id })
        .then(data => {
            res.send({
                message: `${data.deletedCount} logs were deleted successfully!`
            });
        }, err => {
            res.status(500).send({
                message: "Internal Server Error!"
            });
        });
}

// Filter logs by date and time range

exports.filterByDateTimeRange = (req, res) => {
    const id = req.params.id;
    const date = req.params.date;
    const time1 = req.params.time1;
    const time2 = req.params.time2;

    LocationLog
        .find({
            userID: id,
            timestamp: { $gte: date + "T" + time1, $lte: date + "T" + time2 }
        })
        .sort({ timestamp: -1 })
        .then(data => {
            res.status(200).send(data);
        },
            err => {
                res.status(500).send({
                    message: "Internal Server Error!"
                });
            });
}