var LocalStrategy = require('passport-local').Strategy;
var cors = require('cors');
var passport = require('passport');
var functions = require('../../util/functions');
var User = require('../../database/models/user.js');


module.exports = function (passport) {


    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });


    //============================================= SIGNUP =========================================//

    passport.use('local-signup', new LocalStrategy({

        usernameField: 'Email',
        passwordField: 'Password',
        passReqToCallback: true
    },
        function (req, email, password, done) {

            User.findOne({ 'Email': req.body.Email }, function (err, user) {
                console.log(req.body);

                if (err)
                    return done(err);


                if (user == null) {

                    User.find().sort({ $natural: -1 }).limit(1).exec(function (err, data) {

                        if (data.length > 0) {
                            console.log(data[0]);
                            current_last_id = parseInt(data[0].Id);
                            console.log(current_last_id);
                            new_Id_digit = current_last_id + 1;
                            console.log(new_Id_digit);
                            req.body.Id = functions.genId(new_Id_digit, 6);
                            req.body.created_time = functions.Create();

                            console.log(req.body.Id);

                            User.create(req.body, function (err, user) {
                                console.log(err);
                                if (err) {

                                    return done(null, false, req.flash('info', 'Account Already Exist'));

                                } else {

                                    console.log("success");

                                    var user = req.body;
                                    return done(null, user);

                                }
                            });

                        } else {

                            req.body.Id = '000001';



                            User.create(req.body, function (err, user) {

                                if (err) {

                                    console.log('error');

                                } else {

                                    console.log("success");

                                    var user = req.body;
                                    return done(null, user);

                                }
                            });

                        }

                    });

                } else {

                    return done(null, false, req.flash('info', 'Email Already Exist'));

                }

            });

        }));

    //============================================= LOGIN =========================================//

    passport.use('user', new LocalStrategy({

        usernameField: 'Username',
        passwordField: 'Password',
        passReqToCallback: true
    },
        function (req, email, password, done) {
            
            User.findOne({ 'Phone': req.body.Username }, function (err, user) {

                console.log(req.body.Username);

                if (user) {

                    if (user.Password !== req.body.Password) {

                        return done(null, false, req.flash('info', 'Wrong password.'));

                    } else {

                        return done(null, user);

                    }

                } else {

                    User.findOne({ 'Email': req.body.Username }, function (err, data) {


                        if (!data)
                            return done(null, false, req.flash('info', 'User dsnt exist.'));

                        if (data.Password !== req.body.Password)
                            return done(null, false, req.flash('info', 'Wrong password.'));
                        return done(null, data);

                    });


                }


            });

        }

    ));

};
