module.exports = app => {
    const user = require("../Controllers/user.controller.js");

    let router = require("express").Router();

    // Create a new user (Useful if populating database)
    router.post('/', user.createUser);

    // Fetch details of current user
    router.get('/', user.getSelfUser);

    // Fetch details of an user
    router.get('/:id', user.getUser);

    // Update details of current user
    router.put('/', user.updateSelfUser);

    // Update details of an user
    router.put('/:id', user.updateUser);

    // Delete an user
    router.delete('/:id', user.deleteUser);

    // Delete all users
    router.delete('/all', user.deleteAllUsers);

    // Retrieve all users from database
    router.get('/all', user.getAllUsers);

    // Retrieve all users of a particular agency
    router.get('/agency', user.getAgencyUsers);

    app.use('/api/user', router);
};