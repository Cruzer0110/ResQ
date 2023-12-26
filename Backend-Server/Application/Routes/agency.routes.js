module.exports = app => {
    const agency = require("../Controllers/agency.controller.js");

    let router = require("express").Router();

    // Create a new Agency
    router.post("/", agency.create);

    // Retrieve all Agencies
    router.get("/", agency.getAll);

    // Retrieve all Agencies in a given location
    router.get("/location/:lat/:long/:radius", agency.getAllByLocation);

    // Retrieve a single Agency with id
    router.get("/:id", agency.getOne);

    // Update an Agency with id
    router.put("/:id", agency.update);

    // Delete an Agency with id
    router.delete("/:id", agency.delete);

    // Delete all Agencies
    router.delete("/", agency.deleteAll);

    // Retrieve all Agencies of a given type
    router.get("/type/:type", agency.findType);

    app.use('/api/agency', router);
};