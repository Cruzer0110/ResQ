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
const cors = require('cors');
const { initializeApp } = require("firebase-admin");

const firebaseApp = initializeApp({
    credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS)
});

const app = express();

var corsOptions = {
    origin: 'http://localhost:8081'
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
    extended: true
}));

//connecting to database
const db = require("./Application/DB_Models");
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
const routes = [require("./Application/Routes/agency.routes.js"), require("./Application/Routes/user.routes.js")];

routes.forEach(element => {
    element(app);
});

// Invalid route
app.use((req, res) => {
    res.status(404).send({ message: "Invalid route request!" });
});

//setting port
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});