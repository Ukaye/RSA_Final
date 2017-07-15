
var express = require('express');
var app = express();
var passport = require('passport');
var mongoose = require('mongoose');
var configDB = require('./database/config/database.js');
var autoIncrement = require('mongoose-auto-increment');
var port = process.env.PORT || 3000;



//  DB Connection =============================================================

var connection = mongoose.connect(configDB.staging, function (err) {
    if (err) {
        console.log('database connection error', err);
    } else {
        console.log('database connection successful');
    }
});

autoIncrement.initialize(connection);


// Config  =====================================================================

require('./config')(app);

// Auth   ======================================================================

require('./apps/Authentication/AuthConfig')(passport);
require('./apps/Authentication/Auth')(app, passport);


// Admin Auth  ======================================================================

require('./apps/admin/adminAuthConfig')(passport);
require('./apps/admin/adminAuth')(app, passport);

// Home   ======================================================================

require('./apps/Home/routes')(app, passport);

// BVN   ========================================================================

require('./apps/BVN/bvnvalidation')(app);


//  Savings ====================================================================

require('./apps/Save/plan')(app);


//  Profile ====================================================================

require('./apps/Profile/Profile')(app);

//  Bank ====================================================================

require('./apps/Bank/Bank')(app);

//  Dashboard ====================================================================

require('./apps/Dashboard/dashboard')(app);

//  Wallet ====================================================================

require('./apps/wallet/wallet')(app);

//  Admin ====================================================================

require('./apps/admin/admin')(app);



//  Withdraw ====================================================================
require('./apps/withdraw/withdraw')(app);

//  Transaction ====================================================================
require('./apps/Transaction/Transaction')(app);

// launch ======================================================================

app.listen(port);
console.log('listening on localhost:' + port);


