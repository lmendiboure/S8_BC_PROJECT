const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    bcId: String,
    name: String,
    ipAddress: String,
    bcAddress: String,
    email: String,
    password: String
});


module.exports = mongoose.model('User', userSchema);