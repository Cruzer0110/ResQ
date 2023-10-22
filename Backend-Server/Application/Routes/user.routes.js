module.exports = app => {
    const user = require("../Controllers/user.controller.js");

    let router = require("express").Router();

    //User Signup
    router.post("/signup",user.signup);

    //User Login
    router.post("/signin",user.signin);

    app.use('/api/user', router);
};