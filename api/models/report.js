const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    signalingAddress: String,
    pseudo: String,
    description: String,
    date: String
});


module.exports = mongoose.model('Report', reportSchema);
