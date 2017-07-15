var cors = require('cors');
var express = require('express');
var app = express();
var functions = require('../../util/functions');
var passport = require('passport');
var Admin = require('../../database/models/admin.js');



module.exports = function (app, passport) {


    app.post('/admin/login', passport.authenticate('admin', {
        successRedirect: '/admin',
        failureRedirect: '/failed',
        failureFlash: true
    }));



    app.post('/app/admin/login', function (req, res) {
        

        Admin.findOne({ Username: req.body.username }, function (err, data) {
            if (err)
                return res.send(err);

            if (!data)
                return res.send(' Admin not registered');

            if (data) {

                if (data.password !== req.body.Password)
                    return res.send('Wrong password.');

                //else {

                res.send({ status: true, message: "success", data: data });
                //}
            }
        });

    });





   


    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });




}
