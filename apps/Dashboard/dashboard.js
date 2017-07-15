var cors = require('cors');
var express = require('express');
var app = express();
var functions = require('../../util/functions');




module.exports = function (app, passport) {


  app.get('/dashboard', isLoggedIn, function (req, res) {

    res.render('index', { firstname: req.user.first_name, lastname: req.user.last_name });

  });



  function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
      return next();

    res.redirect('/login');
  };



}
