module.exports = app => {
    const agency = require("../Controllers/agency.controller.js");

    let router = require("express").Router();

    // Create a new Agency
    router.post("/agency", agency.create);

    // Retrieve all Agencies
    router.get("/agency", agency.getAll);

    // Retrieve all Agencies in a given location
    router.get("/agency/location/:location", agency.getAllByLocation);

    // Retrieve a single Agency with id
    router.get("/agency/:id", agency.getOne);

    // Update an Agency with id
    router.put("/agency/:id", agency.update);

    // Delete an Agency with id
    router.delete("/agency/:id", agency.delete);

    // Delete all Agencies
    router.delete("/agency", agency.deleteAll);

    // Retrieve all Agencies of a given type
    router.get("/agency/type/:type", agency.findType);

    app.use('/api/agency', router);
};