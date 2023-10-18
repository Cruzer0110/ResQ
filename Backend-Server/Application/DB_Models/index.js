const dbConfig = require("../Server_Config/config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.agencies = require("./agency.schema.js");
db.users = require("./user.schema.js");

module.exports = db;