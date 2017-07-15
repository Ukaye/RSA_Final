var cors        = require('cors');
var express     = require('express');
var app         = express();
var functions   = require('../../util/functions');
var Wallet      = require('../../database/models/Wallet.js');
var Card        = require('../../database/models/Card.js');
var Plan        = require('../../database/models/Plan.js');
var Transactions= require('../../database/models/wallethistory.js');
var Flutterwave = require('flutterwave');
var flutterwave = new Flutterwave("tk_SPaIbxFtXvokrmzpR7Ww", 'tk_r7OywtPnvb');


module.exports = function(app){



app.get('/Wallet', isLoggedIn, function(req, res){

 console.log(req.user);

   res.render('wallet', {firstname:req.user.first_name, lastname:req.user.last_name});

});


app.get('/wallet/:Phone', function(req, res){


 	 Wallet.findOne({Phone:req.params.Phone}, function(err, wallet){


    if (wallet) {
 
   res.send({status:true, data:wallet});

    }else{

         newwallet               = {};
    	 newwallet.created_time  = functions.Create();
    	 newwallet.Phone         = req.params.Phone;


          Wallet.create(newwallet, function(err, user) {
         
                     if (err) {

                      console.log(err);
                      
                   res.send({status:false, message:"error creating wallet"});

                       } else {
                     
                    Wallet.findOne({Phone:req.params.Phone}, function(err, wallet){
                            
                              res.send({status:true, data:wallet});

                   });
                      
                  }
             });
    }


    });

});




var Transaction = function(type, transaction, amount,Phone){
     
     body               = {};
     body.created_time  = functions.Create();
     body.type          = type;
     body.transaction   = transaction;
     body.amount        = bank_name;
     body.Phone         = Phone;


     Transactions.create(body, function(err, history) { });

}


app.post('/fundwallet', function(req, res){

   console.log(req.body);
     
     if (req.body.bank) {

   Bank.findOne({account_number:req.body.bank}, function(err, bank){
   
   res.send({status:false, message:"Bank not available at this time"});

   });

     }else{


 Card.findOne({cardNo:req.body.card}, function(err, card){

        flutterwave.Card.capture({
       amount: req.body.amount,
       currency: "NGN",
       trxreference: card.ref,
       trxauthorizeid: card.Auth

} , function(err, data){

if(err){
        
       res.send({status:false, message:"error funding wallet"});
      

    }else if (data.body.data.responsecode == "00") {

    

        if (req.body.target == "1") {

           Wallet.update({Phone:req.body.Phone}, {$inc:{expense_account:parseInt(req.body.amount)}}, function(err, num){

                 res.send({status:true, message:" funding succesfull"});

         });

        }else{
          
            Wallet.update({Phone:req.body.Phone}, {$inc:{savings:parseInt(req.body.amount)}}, function(err, num){


              Plan.update({_id:req.body.plan}, {$inc:{saved:parseInt(req.body.amount)}}, function(err, num){

                 res.send({status:true, message:"Plan funded successfully"});

         });

              });

         }
        

    }else{

      res.send({status:false, message:"card declined"});
      
    }
       

});


   });


     }
   


});



app.get('/wallethistory/Phone', function(req, res){

   
  Transactions.find({Phone:req.body.Phone}, function(err, history){
        
      res.send({status:true,  data:history});

   });

});










//app.get


 function isLoggedIn(req, res, next) {

   if (req.isAuthenticated())
    return next();

  res.redirect('/login');
};
 
};




            
  