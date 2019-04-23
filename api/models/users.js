const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    bcId: String,
    name: String, //prénom
    lastname: String, //nom
    immatriculation: String,
    ipAddress: String,
    bcAddress: String,
    pseudo: String,
    email: String,
    year: Number,
    vehicle: String, //Type de véhicule
    password: String
});


module.exports = mongoose.model('User', userSchema);