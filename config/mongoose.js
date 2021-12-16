const mongoose = require('mongoose');

var db = process.env.DATABASEURL || "mongodb://localhost:27017/user-auth";

mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


module.exports = db;
