
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var wallethistorySchema = new Schema({

    transaction           : {type: String},
    Phone                 : String,
    type                  : {type: Number},
    amount                : Number,
    created_time          : String
});



module.exports = mongoose.model('wallethistory', wallethistorySchema);