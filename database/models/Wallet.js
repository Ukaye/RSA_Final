
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var walletSchema = new Schema({

    expense_account        : {type:Number, default: 0},
    savings                : {type:Number, default: 0},
    balance                : {type:Number, default: 0},
    Phone                  : String,
    created_time           : String
 
});



module.exports = mongoose.model('Wallet', walletSchema);