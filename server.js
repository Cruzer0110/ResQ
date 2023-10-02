const mongoose = require('mongoose');

const dbURI = 'mongodb+srv://btech1506922:Arc_Bgy%40231@testcluster.p9yip63.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('Connected to DB'))
    .catch((err) => console.log(err));

