var cors = require('cors');
var express = require('express');
var app = express();
var functions = require('../../util/functions');
var Bank = require('../../database/models/Bank.js');
var Card = require('../../database/models/Card.js');
var BankHistory = require('../../database/models/bankhistory.js');
var staging_url = 'http://rte.riby.ng:3000/';
var Live_url = 'https://rte.riby.ng';
var RTE = require('rte-node');
var key = "c12d6b2535f0351a13df5c1d68aed12d";
var tenant_id = "T778";
var token = "$2a$10$2AqinxM4tMWm.Fw0URPLa.wQyWYZRBx/A06F.VcfXght7xsfi5RBy";
var rte = new RTE(tenant_id, key, token, staging_url);
var Flutterwave = require('flutterwave');
var flutterwave = new Flutterwave("tk_SPaIbxFtXvokrmzpR7Ww", 'tk_r7OywtPnvb');


module.exports = function (app) {


    app.post('/addBank',function(req,res){

    });




    app.get('/Bank', isLoggedIn, function (req, res) {


        res.render('bank', { firstname: req.user.first_name, lastname: req.user.last_name });

    });


    var Transaction = function (type, transaction, bank_name, Phone) {

        body = {};
        body.created_time = functions.Create();
        body.type = type;
        body.transaction = transaction;
        body.bank_name = bank_name;
        body.Phone = Phone;


        BankHistory.create(body, function (err, history) { });

    }



    app.post('/validatebank', function (req, res) {

        var acct = {
            bank_code: req.body.bank_code,
            account_number: req.body.account_number
        };

        rte.Bank.resolveBankAccount(acct, function (error, body) {

            if (body.payload) {


                req.body.account_name = body.payload.account_name;
                req.body.created_time = functions.Create();

                Bank.create(req.body, function (err, user) {

                    if (err) {
                        console.log(err);

                        res.send({ status: false, message: "Account number incorrect" });

                    } else {

                        console.log(req.body);

                        res.send({ status: true, data: req.body });
                    }

                });

            } else {

                res.send({ status: false, message: body.responseText });

            }

        });


    });


    app.get('/nigbank', function (req, res) {

        rte.Bank.getAllBanks(function (error, body) {

            res.send({ status: true, data: body.payload });
        });

    });


    app.post('/addbank', function (req, res) {

        console.log(req.body.account_number);

        Bank.update({ account_number: req.body.account_number }, { $set: { status: 2 } }, function (err, num) {
            console.log(err);
            if (err) {

                res.send({ status: false, message: "error confirming account name" });

            } else {

                Bank.findOne({ account_number: req.body.account_number }, function (err, bank) {

                    Transaction(1, "Bank created ", bank.bank_name, bank.Phone);

                    res.send({ status: true, message: "Bank created successfully", data: bank });

                })


            }

        });


    });


    app.post('/addCard', function (req, res) {

        var card = req.body;
        var phone = card.phone;

        //Checks if card already exists
        console.log(card);
        var check = card.no;
        var length = check.length;

        check = check.substring((length - 4), length);

        Card.findOne({ 'cardNo': check }, function (err, card_obj) {
            if (card_obj) {

                res.json({ status: false, message: "Card already exists" });

            } else {

                flutterwave.Card.tokenize({
                    "validateoption": "SMS",
                    "authmodel": "NOAUTH",
                    "cardno": card.no,
                    "cvv": card.cvv,
                    "expirymonth": card.month,
                    "expiryyear": card.year

                }, function (err, response, payload) {

                    if (payload.status == "success") {

                        if (payload.data.responsecode == "00") {
                            console.log(payload);

                            flutterwave.Card.preauth({
                                chargetoken: payload.data.responsetoken,
                                amount: "50",
                                currency: "NGN"
                            }, function (err, charge) {

                                var data = charge.body.data;

                                console.log(data);

                                if (data.responsecode == '00') {


                                    console.log(data);

                                    var number = card.no;
                                    var len = number.length;
                                    card.cardNo = number.substring((len - 4), len);
                                    card.ref = data.transactionreference;
                                    card.Auth = data.authorizeId;
                                    card.Phone = req.body.Phone;


                                    Card.create(card, function (err, newcard) {

                                        if (err) {

                                            console.log(err);

                                            res.send({ status: false, message: "error creating card" });

                                        } else {

                                            res.send({ status: true, data: card, message: "Card added successfully" });

                                        }
                                    });


                                } else {

                                    res.send({ status: false, message: "could not verify card" });

                                }

                            })



                        } else {

                            res.send({ status: false, message: payload.data.responsemessage });
                        }
                    } else {

                        res.json({ status: false, message: "Error tokenizing card" })
                    }
                });
            }
        });
    });



    app.get('/GetBank/:Phone', function (req, res) {


        if (req.params.Phone) {

            Bank.find({ Phone: req.params.Phone, status: 2 }, function (err, bank) {

                res.send({ status: true, data: bank });
            });

        } else {

            res.send({ status: false, message: "Phone required" });
        }

    });

    app.get('/getcard/:Phone', function (req, res) {

        console.log(req.params.Phone);

        if (req.params.Phone) {

            Card.find({ Phone: req.params.Phone }, function (err, card) {

                console.log(card);

                res.send({ status: true, data: card });
            });

        } else {

            res.send({ status: false, message: "Phone required" });
        }

    });


    app.get('/GetunconfirmedBank/:Phone', function (req, res) {


        if (req.params.Phone) {

            Bank.find({ Phone: req.params.Phone, status: 1 }, function (err, bank) {

                res.send({ status: true, data: bank });
            });

        } else {

            res.send({ status: false, message: "Phone required" });
        }

    });



    app.get('/removeBank/:account_number', function (req, res) {


        if (req.params.account_number) {

            Bank.findOne({ account_number: req.params.account_number }, function (err, bank) {

                Bank.remove({ account_number: req.params.account_number }, function (err, num) {

                    if (bank) {

                        Transaction(2, "Bank deleted ", bank.bank_name, bank.Phone);
                        res.send({ status: true, message: "account deleted successfully" });
                    } else {

                        res.send({ status: true, message: "Bank not found" });

                    }

                });

            });


        } else {

            res.send({ status: false, message: "account number required" });
        }

    });



    app.get('/GetBankHistory/:Phone', function (req, res) {


        if (req.params.Phone) {

            BankHistory.find({ Phone: req.params.Phone }, function (err, bank) {

                res.send({ status: true, data: bank });
            });

        } else {

            res.send({ status: false, message: "Phone required" });
        }

    });

  




    function isLoggedIn(req, res, next) {

        if (req.isAuthenticated())
            return next();

        res.redirect('/login');
    };

};





