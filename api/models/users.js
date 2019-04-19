const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    bcId: String,
    name: String,
    surname: String,
    immatriculation: String,
    ipAddress: String,
    bcAddress: String,
    email: String, //pseudo
    mail: String,
    year: Number,
    password: String
});


module.exports = mongoose.model('User', userSchema);