var cors = require('cors');
var express = require('express');
var app = express();
var functions = require('../../util/functions');
var User = require('../../database/models/user.js');

var Flutterwave = require('flutterwave');
var flutterwave = new Flutterwave("tk_SPaIbxFtXvokrmzpR7Ww", 'tk_r7OywtPnvb');


module.exports = function (app) {



    app.get('/bvn', function (req, res) {

        res.render("bvn");

    });


    app.get('/otp', function (req, res) {

        res.render("otp");

    });



    // Verifying BVN 

    app.post('/verifyBVN/:type', function (req, res) {

        var BVN = req.body.bvn;
        var type = req.params.type;

        console.log(type);

        if (type) {
            if (BVN) {
                flutterwave.BVN.verify(type, BVN,
                    function (err, response, payload) {
                        if (payload.status == "success") {
                            if (payload.data.responseCode == "00") {

                                res.json({ status: true, data: payload.data, message: "OTP sent successfully" });

                            } else {

                                res.json({ status: false, message: payload.data.responseMessage });
                            }
                        } else {

                            res.json({ status: false, message: "Error occurred sending OTP" });
                        }
                    }
                );
            } else {

                res.json({ status: false, message: "BVN is required" });
            }
        } else {
            res.json({ status: false, message: "Verification Type is required" });
        }
    });



    //    Validating BVN after recieving OTP


    app.post('/validateBVN', function (req, res) {

        console.log(req.body);
        var Phone = req.body.phone;
        var BVN = req.body.bvn;
        var ref = req.body.transaction_ref;
        var otp = req.body.otp;


        if (BVN) {
            flutterwave.BVN.validate(otp, BVN, ref,
                function (err, response, payload) {
                    if (payload.status == "success") {
                        if (payload.data.responseCode == "00") {
                            User.findOne({ "Phone": Phone }, function (err, user) {

                                if (!user) {
                                    res.json({ status: false, message: "User does not exist" });
                                } else {
                                    User.update({ "Phone": Phone }, { $set: { bvn_status: "validated" } },
                                        function (err, response) {
                                            if (response == 1) {

                                                res.json({ status: true, data: payload.data, message: phone + "'s BVN validation was successful" });

                                            } else {
                                                res.json({ status: true, data: payload.data, message: phone + "'s BVN validation was successful" });
                                            }
                                        }
                                    );
                                }
                            });
                        } else {

                            res.json({ status: false, message: payload.data.responseMessage });
                        }
                    } else {
                        res.json({ status: false, message: "BVN validation failed" });
                    }
                }
            );
        } else {
            res.json({ status: false, message: "BVN is required" });
        }
    });


};





