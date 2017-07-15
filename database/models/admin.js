
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var adminSchema = new Schema({

    Username: {
        type: String
    },
    Password: { type: String }

});

module.exports = mongoose.model('admin', adminSchema);
