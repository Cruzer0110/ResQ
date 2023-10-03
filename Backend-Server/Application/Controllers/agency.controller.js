/*
    This file contains the methods that will be used to handle the requests made to the server 
*/

const db = require("../DB_Models");
const Agency = db.agencies;

// Create and Save a new Agency
exports.create = (req,res) => {
    //Validate request
    if(!req.body.name){
        res.status(400).send({message: "Content cannot be empty!"});
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
        //Fetch location from Google Maps API
    });

    //Save Agency in the database
    agency
        .save(agency)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occured while creating the Agency."
            });
        }
    );
};
// Retrieve all Agencies from the database
exports.getAll = (req,res) => {

};
// Find an Agency with the given ID
exports.getOne = (req,res) => {

};
// Update an Agency by the ID in the request
exports.update = (req,res) => {

};
// Delete an Agency with the specified ID in the request
exports.delete = (req,res) => {

};
// Purge database
exports.deleteAll = (req,res) => {

};
// Find all Agencies with the given type
exports.findType = (req,res) => {

};