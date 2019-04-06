const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    bcId: Number,
    name: String,
    ipAddress: String,
    bcAddress: String
});


module.exports = mongoose.model('User', userSchema);