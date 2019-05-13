const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    bcId: String,
    name: String, 
    ipAddress: Object,
});


module.exports = mongoose.model('Group', groupSchema);
