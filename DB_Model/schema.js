const mongoose = require('mongoose');

//Create mongoose schema for database

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    type: String,
    contact: { type: Number},
});