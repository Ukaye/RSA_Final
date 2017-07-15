
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var bankhistorySchema = new Schema({

    transaction           : {type: String},
    bank_name             : String,
    Phone                 : String,
    type                  : {type: Number},
    created_time          : String,
});



module.exports = mongoose.model('bankhistory', bankhistorySchema);