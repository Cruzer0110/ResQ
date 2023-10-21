module.exports = app => {
    const agency = require("../Controllers/agency.controller.js");

    let router = require("express").Router();

    app.use('/api/user', router);
};