module.exports = app => {
    const locationLog = require("../Controllers/locationLog.controller.js");

    let router = require("express").Router();

    // Create a new Location Log
    router.post("/", locationLog.create);

    // Retrieve logs of a user from database for generating current location
    router.get("/:id", locationLog.getByID);

    // Retrieve logs of a user from database to generate location history
    router.get("/history/:id", locationLog.getHistory);

    // Retrieve logs of all users from database to generate heat map data
    router.get("/", locationLog.getAll);

    // Retrieve location data in a certain radius for agencies to see events in their area
    router.get("/radius/:lat/:long/:radius", locationLog.getRadius);

    // Update a log with id
    router.put("/:id", locationLog.update);

    // Delete logs of user with id
    router.delete("/:id", locationLog.deleteAll);

    // Filter logs by date and time range
    router.get("/filter/:id/:date/:time1/:time2", locationLog.filterByDateTimeRange);

    app.use('/api/locationLog', router);
};