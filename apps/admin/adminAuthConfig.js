var LocalStrategy = require('passport-local').Strategy;
var cors = require('cors');
var passport = require('passport');
var functions = require('../../util/functions');
var Admin = require('../../database/models/admin.js');


module.exports = function (passport) {


    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });



    //============================================= LOGIN =========================================//

    passport.use('admin', new LocalStrategy({

        usernameField: 'Username',
        passwordField: 'Password',
        passReqToCallback: true
    },
        function (req, email, password, done) {
            
            Admin.findOne({ Username: req.body.username }, function (err, data) {
                if (err)
                    return done(null, false, req.flash('info', ' Error'));

                if (!data)
                    return done(null, false, req.flash('info', ' Admin not registered'));

                if (data) {

                    if (data.password !== req.body.Password)
                        return done(null, false, req.flash('info', 'Wrong password.'));

                    //else {
                    return done(null, data);
                    //res.send({ status: true, message: "success", data: data });
                    //}
                }
            });

        }));

};
