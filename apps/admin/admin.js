var express = require('express'),
    app = express(),
    cors = require('cors'),
    Bank = require('../../database/models/Bank.js'),
    Bankhistory = require('../../database/models/bankhistory.js'),
    Card = require('../../database/models/Card.js'),
    Plan = require('../../database/models/Plan.js'),
    User = require('../../database/models/user.js'),
    Wallet = require('../../database/models/Wallet.js'),
    Admin = require('../../database/models/admin.js'),
    Wallethistory = require('../../database/models/wallethistory.js')
     passport = require("passport");
     LocalStrategy = require("passport-local").Strategy;





module.exports = function (app) {


    app.get('/admin-dashboard', isLoggedIn, function (req, res) {

        res.render("admin/index",{ firstname: req.user.first_name, lastname: req.user.last_name });

    });



    app.get('/admin/forgottenemail', function (req, res) {

        res.render("admin/femail");

    });

    app.get('/admin/forgottenpassword', function (req, res) {

        res.render("admin/fpw");

    });

    app.get('/admin/history', isLoggedIn, function (req, res) {

        res.render("admin/history",{ firstname: req.user.first_name, lastname: req.user.last_name });

    });

    app.get('/admin/loans', isLoggedIn, function (req, res) {

        res.render("admin/loans",{ firstname: req.user.first_name, lastname: req.user.last_name });

    });

    app.get('/admin/login', function (req, res) {

        res.render("admin/login");

    });

    app.get('/admin/loginerror', function (req, res) {

        res.render("admin/loginerror");

    });

    app.get('/admin/notifs', isLoggedIn, function (req, res) {

        res.render("admin/notifs",{ firstname: req.user.first_name, lastname: req.user.last_name });

    });
    app.get('/admin/settings', isLoggedIn, function (req, res) {

        res.render("admin/settings",{ firstname: req.user.first_name, lastname: req.user.last_name });

    });
    app.get('/admin/withdraw', isLoggedIn, function (req, res) {

        res.render("admin/withdraw",{ firstname: req.user.first_name, lastname: req.user.last_name });

    });




    app.get('/users-bank', function (req, res) {

        Bank.find({}, function (err, bank_obj) {
            if (err) {
                console.log(err);
                res.send('invalid request');
            };
            return res.send({ status: true, Data: bank_obj });


        });
    });

    app.get('/users-bankhistory', function (req, res) {

        Bankhistory.find({}, function (err, bankhistory_obj) {
            if (err) throw (err);
            return res.send({ status: true, Data: bankhistory_obj });

        });
    });

    app.get('/users-card', function (req, res) {

        Card.find({}, function (err, card_obj) {
            if (err) throw (err);
            return res.send({ status: true, Data: card_obj });

        });
    });


    app.get('/users-plan', function (req, res) {
        console.log('show users plan');
        Plan.find({}, function (err, plan_obj) {

            if (err) throw (err);
            return res.send({ status: true, Data: plan_obj });

        });
    });



    app.get('/totalplan', function (req, res) {


        Plan.count(function (err, count) {
            if (err) { res.send(err) };
            res.json(count);

        });
    });


    app.get('/allplan', function (req, res) {
        console.log('count amount plan');

        Plan.count(function (err, count) {
            if (err) { res.send(err) };
            res.json({ 'value': count });

        });
    });


    app.get('/allusers', function (req, res) {
        console.log('count amount plan');

        User.count({access:0},function (err, user) {
            if (err) { res.send(err) };
            res.json({ 'value': user });

        });
    });



    app.get('/totalsavings', function (req, res) {

     
      Plan.find({}, function(err, plans){
     
       total_savings = 0;

        plans.forEach(function(plan){
         
          total_savings+=plan.saved;
       
        });


        res.send({status:true, data:total_savings});

      });


    });



        app.get('/totalplansvalue', function (req, res) {

     
      Plan.find({}, function(err, plans){
     
       total_savings_value = 0;

        plans.forEach(function(plan){
         
          total_savings_value += parseInt(plan.amount);
       
        });


        res.send({status:true, data:total_savings_value});

      });


    });

       
       app.post('/createadmin', function(req, res){


               console.log(req.body);

                User.create(req.body, function (err, user) {

                    if (err) {
                        console.log(err);

                        res.send({ status: false, message: "error creating Admin" });

                    } else {

                       

                        res.send({status: true, data: req.body});
                    }

                });

       });



    app.get('/users', function (req, res) {

        User.find({}, function (err, user_obj) {
            if (err) throw (err);
            return res.send({ status: true, Data: user_obj });

        });
    });

    app.get('/users-wallet', function (req, res) {

        Wallet.find({}, function (err, wallet_obj) {
            if (err) throw (err);
            return res.send({ status: true, Data: wallet_obj });

        });
    });

    app.get('/users-wallethistory', function (req, res) {

        Wallethistory.find({}, function (err, wallethistory_obj) {
            if (err) throw (err);
            return res.send({ status: true, Data: wallethistory_obj });


        });
    });




    app.post('/admin-changepassword', function (req, res) {

        var admin = new Admin();

        var details = {
            Username: 'Admin',
            Password: req.body.password,
        }

        Admin.findOneAndUpdate({ Username: req.body.username }, details, function (err, upd) {
            if (err) {
                res.send(err);
                console.log(err);
            }
            else {
                console.log('Password updated successfully');
                res.send({ status: true, data: 'Password updated successfully' });
            }
        });
        //}
    });



    app.post('/admin-login', function (req, res) {

        console.log('admin trying to log in');
        Admin.findOne({ Username: req.body.username }, function (err, data) {
            if (err) {
                res.send(err);
                console.log(err);
            }
            if (!data) {
                res.send({ status: false, message: 'Admin not found' });
            }
            if (data) {

                if (data.password !== req.body.Password) {

                    res.send({ status: false, message: "Wrong password." });

                } else {

                    res.send({ status: true, message: "success", data: data });
                }
            }
        });
    });

    app.get('/verifiedsavers', function (req, res) {

        Plan.distinct('Phone', function (err, plan_obj) {
            if (err) throw err;

            console.log(plan_obj.length);
            res.send({ value: plan_obj.length });
        })
    });


    function isLoggedIn(req, res, next) {

        if (req.isAuthenticated()){
            

                if (req.user.access !== 1) {

            res.redirect('/access-denied');

          }else{

            return next();

          }

        }else{
         
           res.redirect('/login');

        }

      
    };

}//);




