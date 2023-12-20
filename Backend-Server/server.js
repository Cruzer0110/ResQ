/**
 *  This is the entry point of the backend server of ResQ.
 *  This file is responsible for connecting to the database and starting the server.
 *  It collects the routes, database elements and other important resources from different locations and combines them to form the backend server.
 *  It also sets the port on which the server will be running.
 *  
 *  Author: Cruzer0110
*/
require('dotenv').config({
    path: `${__dirname}/Application/Server_Config/.env`
});
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const cors = require('cors');
const webSockets = require("./WebSockets");
const routes = require("./Application/Routes");
const db = require("./Application/DB_Models");
const middleware = require("./Application/Middleware/middleware.js");

const app = express();

let corsOptions = {
    origin: 'http://localhost:8081'
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
    extended: true
}));

// Middleware to verify client token for all requests
app.use(middleware.decodeToken);

// Connecting to database
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to database!");
    }, err => {
        console.log("Cannot connect to database!\n", err);
        process.exit();
    });

//Main route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the backend server" });
});

//Api routes
routes.forEach(element => {
    element(app);
});

// Invalid route
app.use((req, res) => {
    res.status(404).send({ message: "Invalid route request!" });
});

//setting up ssl
// const cred = {
//     key: fs.readFileSync(process.env.SSL_KEY_PATH),
//     cert: fs.readFileSync(process.env.SSL_CERT_PATH)
// };

//setting port
const PORT = process.env.PORT || 8080;

// Starting the server
// const server = https.createServer(cred,app).listen(PORT, () => {
const server = http.createServer(app).listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//socket.io
webSockets.forEach(socket => new socket(server));
