
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var bankSchema = new Schema({
    account_name          : {type:String,  required:true},
    account_number        : {type:String,  unique:true, required:true},
    bank_name             : {type:String,  required:true},
    Phone                 : {type:String,  required:true},
    created_time          : String,
     status               : {type:Number, default: 1}
 
});



module.exports = mongoose.model('Bank', bankSchema);