
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var planSchema = new Schema({
    Id: String,
    plan_name: { type: String },
    Phone: String,
    deduction_freq: { type: String, required: true },
    duration: { type: String, required: true },
    created_time: String,
    amount: { type: String, required: true },
    target_amount: { type: String, required: true },
    deduction_day: { type: String },
    saved: { type: Number, default: 0 },
    status: { type: Number, default: 1 }
});



module.exports = mongoose.model('Plan', planSchema);