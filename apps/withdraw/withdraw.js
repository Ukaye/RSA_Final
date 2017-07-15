var cors = require('cors');
var express = require('express');
var app = express();
var functions = require('../../util/functions');
var Withdrawal = require('../../database/models/withdrawal.js');
var User = require('../../database/models/user.js');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


module.exports = function (app) {


    app.post('/withdrawal', isLoggedIn, function (req, res) {


        User.findOne({ Phone: req.body.phone }, function (err, user) {


            if (!user) {

                res.send({ status: true, data: 'User not registered' });
                console.log('user not found');
            } else {
                console.log('User found');
                var withdraw = new Withdrawal();

                withdraw.first_name = req.body.firstname;
                withdraw.Email = req.body.email;
                withdraw.Amount = req.body.amount;
                withdraw.Phone = req.body.phone;


                withdraw.save(function (err, with_obj) {

                    if (err) {

                        console.log(err);

                        res.send({ status: false, message: "error creating withdrawal request" });

                    } else {
                        //with_obj
                        console.log(with_obj);
                        res.send({ status: true, data: 'Withdrawal request sent to Admin' });
                    }
                });
            }


        });

    });


    app.get('/allwithdrawal', function (req, res) {
        Withdrawal.find({}, function (err, withdrawal_obj) {
            if (err) {
                console.log(err);
            }
            else {
                res.send({ status: true, value: withdrawal_obj });
            }
        });
    })

    app.post('/withdraw-request', function (req, res) {

        var mailOptions = {
            service: '',
            port: 465,
            auth: {
                user: '',
                pass: ''
            }
        }
        var transporter = nodemailer.createTransport(mailOptions);

        var senderEmail = 'admin@ruby.com';
        var emailTo = req.body.email;
        var subject = 'Withdrawal request ';
        var text = req.body.message;

        var mailOptions = {
            from: senderEmail,
            to: emailTo,
            subject: subject,
            text: text
        };

        // Send the email
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
                res.status(500).send({
                    "message": "Message sending failed",
                    "error": err
                });
            }
            else {
                res.json({ success: true, message: "Message sent successfully", response: info });
            }
        });

        // Free Up Resources After Execution
        transporter.close();
    }
    );

    app.get('/withdraw-request', function (err, withdraw_object) {
        var p = Plan.aggregate([{
            $group: {
                _id: null,
                total: {
                    $sum: "$saved"
                }
            }
        }], function (err, result) {
            res.send({ 'value': result[0].total });
            console.log(result[0].total);
        });


    });



    function isLoggedIn(req, res, next) {

        if (req.isAuthenticated())
            return next();

        res.redirect('/login');
    };

};





