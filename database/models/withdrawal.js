
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var withdrawalSchema = new Schema({

    Amount: { type: Number },
    Phone: { type: String},
    status: {
        type: Boolean,
        default: true
    }
});



module.exports = mongoose.model('withdraw', withdrawalSchema);