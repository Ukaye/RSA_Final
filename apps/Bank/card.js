var express = require('express'),
    app = express(),
    functions = require('../../util/functions'),
    Bank = require('../../database/models/Bank.js'),
    Card = require('../../database/models/Card.js'),
    config = require('../../database/config/database.js'),
    RTE = require('rte-node'),
    rte = new RTE (config.rte.Tenant_ID, config.rte.Key, config.rte.Token, config.rte.Base_Url);

module.exports = function (app) {

    app.get('/rte/get-all-banks', function(req, res){
        rte.Bank.getAllBanks(function(error, body){
            if (body.responseCode == 1)
                return res.json({status: true, message: "All banks fetched successfully", data: body.payload});
            return res.json({status: false, message: "An error occurred while fetching all banks", error: body.responseText});
        });
    });

    app.get('/rte/get-user-bank/:bank_code/:account_number', function(req, res){
        var bank_code = req.params.bank_code,
            account_number = req.params.account_number,
            options = {
                bank_code : bank_code,
                account_number : account_number
            }
        if (!bank_code || !account_number)
            return res.json({status: false, message: "Required Parameter(s) not sent"});
        rte.Bank.resolveBankAccount(options, function(error, body){
            if (body.responseCode == 1)
                return res.json({status: true, message: "Bank fetched successfully", data: body.payload});
            return res.json({status: false, message: "An error occurred while fetching bank", error: body.responseText});
        });
    });

    app.post('/rte/create-user', function(req, res){
        var user = req.body;
        if (!user)
            return res.json({status: false, message: "Required Parameter(s) not sent"});
        rte.User.create(user, function(error, body){
            if (body.responseCode == 1)
                return res.json({status: true, message: "User created successfully", data: body.payload});
            return res.json({status: false, message: "An error occurred while creating user", error: body.responseText});
        });
    });

    app.get('/rte/get-user/:user_id', function(req, res){
        var user_id = req.params.user_id,
            options = {
                skip : 0,
                limit : 20,
                user_id : user_id
            };
        if (!user_id)
            return res.json({status: false, message: "Required Parameter(s) not sent"});
        rte.User.find(options, function(error, body){
            if (body.responseCode == 1)
                return res.json({status: true, message: "User fetched successfully", data: body.payload.users[0]});
            return res.json({status: false, message: "An error occurred while fetching user", error: body.responseText});
        });
    });

    app.get('/rte/get-all-users/:skip?/:limit?', function(req, res){
        var skip = (req.params.skip == undefined) ? 0 : parseInt(req.params.skip),
            limit = (req.params.limit == undefined) ? 20 : parseInt(req.params.limit),
            options = {
                skip : skip,
                limit : limit
            };
        rte.User.find(options, function(error, body){
            if (body.responseCode == 1)
                return res.json({status: true, message: "All users fetched successfully", data: body.payload.users});
            return res.json({status: false, message: "An error occurred while fetching all users", error: body.responseText});
        });
    });

    app.post('/rte/update-user-card/:user_id', function(req, res){
        var user_id = req.params.user_id,
            card = req.body;
        card.user_id = user_id;
        if (!user_id || !card)
            return res.json({status: false, message: "Required Parameter(s) not sent"});
        rte.User.updateUserCard(card, function(error, body){
            if (body.responseCode == 1)
                return res.json({status: true, message: "Card updated successfully", data: body.payload});
            return res.json({status: false, message: "An error occurred while updating card", error: body.responseText});
        });
    });

    app.post('/rte/add-user-bankaccount/:user_id', function(req, res){
        var user_id = req.params.user_id,
            bank = req.body;
        bank.user_id = user_id;
        if (!user_id || !bank)
            return res.json({status: false, message: "Required Parameter(s) not sent"});
        rte.User.addUserBankAccount(bank, function(error, body){
            if (body.responseCode == 1)
                return res.json({status: true, message: "Bank updated successfully", data: body.payload});
            return res.json({status: false, message: "An error occurred while updating bank", error: body.responseText});
        });
    });

    app.delete('/rte/delete-user-card/:user_id/:card_number', function(req, res){
        var user_id = req.params.user_id,
            card_number = req.params.card_number,
            options = {
                user_id : user_id,
                card_number : card_number
            };
        if (!user_id || !card_number)
            return res.json({status: false, message: "Required Parameter(s) not sent"});
        rte.User.deleteUserCard(options, function(error, body){
            if (body.responseCode == 1)
                return res.json({status: true, message: "Card deleted successfully", data: body.payload});
            return res.json({status: false, message: "An error occurred while deleting card", error: body.responseText});
        });
    });

    app.delete('/rte/delete-user-card/:user_id/:card_number', function(req, res){
        var user_id = req.params.user_id,
            card_number = req.params.card_number,
            options = {
                user_id : user_id,
                card_number : card_number
            };
        if (!user_id || !card_number)
            return res.json({status: false, message: "Required Parameter(s) not sent"});
        rte.User.deleteUserCard(options, function(error, body){
            if (body.responseCode == 1)
                return res.json({status: true, message: "Card deleted successfully", data: body.payload});
            return res.json({status: false, message: "An error occurred while deleting card", error: body.responseText});
        });
    });

    app.delete('/rte/delete-user-bankaccount/:user_id/:account_number', function(req, res){
        var user_id = req.params.user_id,
            account_number = req.params.account_number,
            options = {
                user_id : user_id,
                account_number : account_number
            };
        if (!user_id || !account_number)
            return res.json({status: false, message: "Required Parameter(s) not sent"});
        rte.User.deleteUserBankAccount(options, function(error, body){
            if (body.responseCode == 1)
                return res.json({status: true, message: "Bank deleted successfully", data: body.payload});
            return res.json({status: false, message: "An error occurred while deleting bank", error: body.responseText});
        });
    });

    app.post('/rte/initiate-card-debit/:user_id', function(req, res){
        var user_id = req.params.user_id,
            transaction = req.body;
        transaction.user_id = user_id;
        if (!user_id || !transaction)
            return res.json({status: false, message: "Required Parameter(s) not sent"});
        rte.Transaction.initiateDebitSecureCardTransaction(transaction, function(error, body){
            if (body.responseCode == 1)
                return res.json({status: true, message: "Payment initiated successfully", data: body.payload});
            return res.json({status: false, message: "An error occurred while initiating payment", error: body.responseText});
        });
    });
    
    app.post('/rte/recurrent-card-debit/:user_id', function(req, res){
        var user_id = req.params.user_id,
            transaction = req.body;
        transaction.user_id = user_id;
        if (!user_id || !transaction)
            return res.json({status: false, message: "Required Parameter(s) not sent"});
        rte.Transaction.makeRecurentCardDebitTransaction(transaction, function(error, body){
            if (body.responseCode == 1)
                return res.json({status: true, message: "Payment completed successfully", data: body.payload});
            return res.json({status: false, message: "An error occurred while debiting card", error: body.responseText});
        });
    });

    app.get('/rte/get-user-transactions/:user_id', function(req, res){
        var user_id = req.params.user_id,
            options = {
                skip : 0,
                limit : 20,
                user_id : user_id
            };
        if (!user_id)
            return res.json({status: false, message: "Required Parameter(s) not sent"});
        rte.Transaction.findById(options, function(error, body){
            if (body.responseCode == 1)
                return res.json({status: true, message: "Transactions fetched successfully", data: body.payload.transactions});
            return res.json({status: false, message: "An error occurred while fetching transactions", error: body.responseText});
        });
    });

    app.get('/rte/get-all-transactions/:skip?/:limit?', function(req, res){
        var skip = (req.params.skip == undefined) ? 0 : parseInt(req.params.skip),
            limit = (req.params.limit == undefined) ? 20 : parseInt(req.params.limit),
            options = {
                skip : skip,
                limit : limit
            };
        rte.Transaction.find(options, function(error, body){
            if (body.responseCode == 1)
                return res.json({status: true, message: "All transactions fetched successfully", data: body.payload.transactions});
            return res.json({status: false, message: "An error occurred while fetching all transactions", error: body.responseText});
        });
    });

}