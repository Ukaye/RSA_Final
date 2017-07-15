
var RTE = require('rte-node');
var key = "c12d6b2535f0351a13df5c1d68aed12d";
var tenant_id = "T778";
var staging_url = 'http://rte.riby.ng:3000/';
var token = "$2a$10$2AqinxM4tMWm.Fw0URPLa.wQyWYZRBx/A06F.VcfXght7xsfi5RBy";
var rte = new RTE(tenant_id, key, token, staging_url);





module.exports = function (app) {


    /**
     * add new user
     */

    app.post('/newuser', function (req, res) {
        var user = {
            user_id: req.body.user_id,
            username: req.body.username,
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone_number: req.body.phone_number,
            bvn: req.body.bvn
        };
        rte.User.create(user, function (error, body) {
            console.log(body);
        });
    })


    /**
     * add card
     */
    app.post('/addcard', function (req, res) {


        var options = {
            "user_id": req.body.user_id,
            "card_type": req.body.card_type,
            "number": req.body.card_number,
            "issuer": req.body.issuer,
            "cvv2": req.body.cvv2,
            "expiry_month": req.body.expiry_month,
            "expiry_year": req.body.expiry_year
        };

        rte.User.updateUserCard(options, function (err, body) {
            if (err) {
                res.send(err);
                //console.log(err);
            }
            res.send(body);
            console.log(body);
        });


    });

    /**
     * delete user card
     */
    app.post('/deletecard', function (req, res) {
        var options = {
            "user_id": req.body.user_id,
            "card_number": req.body.card_number
        };


        rte.User.deleteUserCard(options, function (err, body) {
            if (err) {

                res.send('error');
            }
            res.send(body);
            console.log(body);
        });


    });

    /**
     * add new  bank account
     */

    app.post('/addbank', function (req, res) {


        var options = {
            "user_id": req.body.user_id,
            "name": req.body.name,
            "number": req.body.number,
            "bank_name": req.body.bank_name,
            "bank_code": req.body.bank_code
        };



        rte.User.addUserBankAccount(options, function (error, body) {
            if (error) {
                console.log(err);
                throw err;
            }
            res.send(body);
            console.log(body);
        });


    });


    /**
     * delete existing bank account
     */
    app.post('/deletebankaccount', function (req, res) {

        var options = {
            "user_id": req.body.user_id,
            "account_number": req.body.number,

        };


        rte.User.deleteUserBankAccount(options, function (err, body) {
            if (err) {
                res.send(err);
            }
            res.send(body);
            console.log(body);
        });

    });

    /**
    * delete user card
    */
    app.post('/deletecard', function (req, res) {

        var options = {
            "user_id": req.body.user_id,
            "account_number": req.body.number,

        };

        rte.User.deleteUserCard(options, function (error, body) {
            if (error) {
                res.send(err);
            }
            console.log(body);
            res.send(body);

        });

    });


    /**
     * debit user card
     * add money
     */
    app.post('/debitcard', function (req, res) {

        var vars = {
            amount: req.body.amount,
            type: req.body.type,
            user_id: req.body.user_id,
            email: req.body.email
        };

        rte.Transaction.initiateDebitSecureCardTransaction(vars, function (error, body) {
            if (error) {
                res.send(err);
            }
            var url=body.payload.responseurl;
            res.redirect(url);
            console.log(body.payload.responseurl);
        });

    });

    /**
     * Debit already saved card
     */

    app.post('/recurringdebitcard', function (req, res) {

        var vars = {
            amount: req.body.amount,
            type: req.body.type,
            user_id: req.body.user_id,
            email: req.body.email
        };

        rte.Transaction.makeRecurentCardDebitTransaction(vars, function (error, body) {
            if (error) {
                res.send(err);
            }
            res.send(body);
            console.log(body);
        });

    });
    /**
     * view all transaction 
     */
    app.get('/alltransaction', function (req, res) {
        var options = {
            skip: 0,
            limit: 20,
        };

        rte.Transaction.find(options, function (error, body) {
            if (error) {
                res.send(error)
            }
            res.send(body);
            console.log(body);
        });
    });

    /**
     * delete user card
     */

    app.post('/deleteusercard', function (req, res) {
        var options = {
            "user_id": req.body.user_id,
            "account_number": req.body.account_number,
        };

        rte.User.deleteUserBankAccount(options, function (error, body) {
            if (error) {
                res.send(error)
            }
            res.send(body);
            console.log(body);
        });
    })

    /**
     * get all available banks
     */

    app.get('/showbanks', function (req, res) {
        rte.Bank.getAllBanks(function (error, body) {
            if (err) {
                res.send(err);
            }
            res.send(body);
            console.log(body);
        });
    });

    /**
     * verify user account
     */
    app.post('/verifyaccount', function (req, res) {
        var acct = {
            bank_code: req.body.bank_code,
            account_number: req.body.account_number
        };


        rte.Bank.resolveBankAccount(acct, function (error, body) {
            if (error) {
                res.send(body);
            }
            res.send(body);
            console.log(body);
        });
    });


    /**
     * view user information
     */

    app.get('/viewuser', function (error, body) {
        var options = {
            skip: 0,
            limit: 20, // limit Cannot be greater than 50
        };

        rte.User.find(options, function (error, body) {
            if (error) {
                res.send(error);
            }
            res.send(body);
            console.log(body);
        });
    })
};





