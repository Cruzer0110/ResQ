require('dotenv').config({
    path: `${__dirname}/../Server_Config/.env`
});
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGO_URI;
db.agencies = require("./agency.schema.js");
db.users = require("./user.schema.js");
db.locationLogs = require("./locationLog.schema.js");

module.exports = db;