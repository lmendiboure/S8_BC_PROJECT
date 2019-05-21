const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    grIP : String,
    grId: String,
    name: String, 
    list : [],

});


module.exports = mongoose.model('Group', groupSchema);
