var cors = require('cors');
var express = require('express');
var app = express();
var functions = require('../../util/functions');




module.exports = function (app, passport) {


  app.get('/', function (req, res) {


    res.redirect('/login');

  });

  app.get('/admin/login', function (req, res) {

    res.render("admin/login");

  });

  app.get('/login', function (req, res) {

    res.render('login');

  });


  app.get('/signup', function (req, res) {

    res.render('register');

  });

  app.post('/admin/login', passport.authenticate('admin', {
    
    successRedirect: '/success',
    failureRedirect: '/failed',
    failureFlash: true
  }));

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/success',
    failureRedirect: '/failed',
    failureFlash: true
  }));


  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/success',
    failureRedirect: '/failed',
    failureFlash: true
  }));



  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });




}
