var cors = require('cors');
var express = require('express');
var app = express();
var functions = require('../../util/functions');
var passport = require('passport');
var User = require('../../database/models/user.js');


module.exports = function (app, passport) {


  app.post('/login', passport.authenticate('user', {
    successRedirect: '/success',
    failureRedirect: '/failed',
    failureFlash: true
  }));


  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/success',
    failureRedirect: '/failed',
    failureFlash: true
  }));


  app.get('/failed', function (req, res) {

    message = req.flash('info');

    res.send({
      status: false,
      message: message[0]
    });


  });


  app.post('/app/login', function (req, res) {


    User.findOne({
      'Phone': req.body.Username
    }, function (err, data) {

      if (data) {

        if (data.Password !== req.body.Password) {

          res.send({
            status: false,
            message: "Wrong password."
          });

        } else {

          res.send({
            status: true,
            message: "success",
            data: data
          });

        }

      } else {

        User.findOne({
          'Email': req.body.Username
        }, function (err, user) {


          if (!user) {

            res.send({
              status: false,
              message: "user doesn't  exist"
            });

          } else if (user.Password !== req.body.Password) {

            res.send({
              status: false,
              message: "Wrong password."
            });


          } else {

            res.send({
              status: true,
              message: "success",
              data: user
            });
          }

        });


      }


    });

  });


  app.post('/app/signup', function (req, res) {

    User.findOne({
      'Email': req.body.Email
    }, function (err, user) {
      console.log(req.body);

      if (err)
        return done(err);


      if (user == null) {

        User.find().sort({
          $natural: -1
        }).limit(1).exec(function (err, data) {

          if (data.length > 0) {

            current_last_id = parseInt(data[0].Id);
            new_Id_digit = current_last_id + 1;
            req.body.Id = functions.genId(new_Id_digit, 6);
            req.body.created_time = functions.Create();

            console.log(req.body.Id);

            User.create(req.body, function (err, user) {
              console.log(err);
              if (err) {


                res.send({
                  status: false,
                  message: 'Account Already Exist'
                });

              } else {

                console.log("success");

                var user = req.body;
                res.send({
                  status: true,
                  message: "success",
                  data: user
                });

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

                res.send({
                  status: true,
                  message: "success",
                  data: user
                });
              }
            });

          }

        });

      } else {


        res.send({
          status: false,
          message: 'Email Already Exist'
        });

      }

    });


  });


  app.get('/success', function (req, res) {

    message = req.flash('info');

    if (req.user.access) {

      if (req.user.access = 1) {

        res.send({
          status: true,
          message: "success",
          data: req.user,
          location: "admin-dashboard"
        });


      } else {

        res.send({
          status: true,
          message: "success",
          data: req.user,
          location: "dashboard"
        });

      }

    } else {

      res.send({
        status: true,
        message: "success",
        data: req.user,
        location: "dashboard"
      });

    }

  });


  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });


}