
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    Id            : String,
    first_name    : {type: String},
    last_name     : {type: String},
    Email         : {type:String, unique:true, required:true},
    Password      : {type: String, required:true},
    Phone         : {type: String, unique:true},
    wallet        : {type:Number, default:0},
    created_time  : String,
    bvn_status    : String,
    status        : {type:Number, default: 1},
    access        : {type:Number, default:0}
});



module.exports = mongoose.model('User', userSchema);