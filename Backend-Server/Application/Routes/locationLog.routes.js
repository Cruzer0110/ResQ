module.exports = app => {
    const locationLog = require("../Controllers/locationLog.controller.js");

    let router = require("express").Router();

    // Create a new Location Log
    router.post("/", locationLog.create);

    // Retrieve logs of a user from database
    router.get("/:id", locationLog.getByID);

    app.use('/api/locationLog', router);
};