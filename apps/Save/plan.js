var cors = require('cors');
var express = require('express');
var app = express();
var functions = require('../../util/functions');
var Plan = require('../../database/models/Plan.js');
var User = require('../../database/models/user.js');



module.exports = function (app) {



  app.get('/allplans', isLoggedIn, function (req, res) {


    res.render('allplans', { firstname: req.user.first_name, lastname: req.user.last_name });

  });

  app.post('/createplan', function (req, res) {

    User.findOne({ Phone: req.body.Phone }, function (err, user) {

      if (user) {



        Plan.find({ Phone: req.body.Phone }).sort({ $natural: -1 }).limit(1).exec(function (err, data) {



          if (data.length > 0) {


            newplan = req.body;
            current_last_id = parseInt(data[0].Id);
            new_Id_digit = current_last_id + 1;
            plan_Id = functions.genId(new_Id_digit, 3);
            newplan.Id = user.Id + "-" + plan_Id;
            newplan.created_time = functions.Create();


            Plan.create(newplan, function (err, user) {

              if (err) {

                console.log(err);

                res.send({ status: false, message: "error creating plan" });

              } else {

                res.send({ status: true, message: "plan created successfully" });

              }
            });


          } else {

            newplan = req.body;
            newplan.created_time = functions.Create();


            Plan.create(newplan, function (err, user) {

              if (err) {

                console.log(err);

                res.send({ status: false, message: "error creating plan" });

              } else {

                res.send({ status: true, message: "plan created successfully" });

              }
            });
          }



        });

      } else {

        res.send({ status: false, message: "user does not exist" });
      }

    });

  });



  app.get('/plans/:Phone', function (req, res) {

    if (req.params.Phone) {

      Plan.find({ Phone: req.params.Phone }, function (err, data) {


        if (data.length > 0) {


          res.send({ status: true, data: data });

        } else {

          res.send({ status: false, message: "plan not found" });
        }
      });

    } else {

      res.send({ status: false, message: "Phone required" });
    }

  });




  app.get('/planname/:Phone', function (req, res) {


    User.findOne({ Phone: req.params.Phone }, function (err, user_obj) {
      if (err) {
        console.log(err);
        res.send({ status: false, Data: "Error" });
      }
      if (!user_obj) {
        console.log('user not found');
        res.send({ status: false, Data: "user not found" });
      } else {
        Plan.find({ Phone: req.params.Phone }, { "plan_name": 1, "amount": 1, _id: 0 }, function (err, plan_obj) {
          //{ "plan_name": 1, "amount": 1, _id: 0 }
          if (err) {
            res.send({ status: false, message: 'error' });
            // console.log(err);
          }
          else {
            //res.send({ "status": true, data: plan_obj });
            res.send(plan_obj);
          }
        });
      }
    });
  });



  app.post('/amountsaved', function (req, res) {

    // console.log(req.query.Phone);
    //req.query.id
    Plan.find({ Phone: req.body.Phone }, { "created_time": 1, _id: 0 }, function (err, plan_obj) {
      console.log('lets try the amount he wants to use');

      if (err) {
        res.send(err);
      }
      console.log(plan_obj)
      res.send(plan_obj);

    });
  })





  function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
      return next();

    res.redirect('/login');
  };


};





