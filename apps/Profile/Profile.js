var cors      = require('cors');
var express   = require('express');
var app       = express();
var functions = require('../../util/functions');
var User      = require('../../database/models/user.js');
var staging_url   = 'http://rte.riby.ng:3000/';
var Live_url      = 'https://rte.riby.ng';
var RTE           = require('rte-node');
var key           = "c12d6b2535f0351a13df5c1d68aed12d";
var tenant_id     = "T778";
var token         = "$2a$10$2AqinxM4tMWm.Fw0URPLa.wQyWYZRBx/A06F.VcfXght7xsfi5RBy";
var rte           = new RTE(tenant_id, key, token, staging_url);



module.exports = function(app){


app.post('/Updateprofile', function(req, res){
 
User.update({Phone:req.body.Phone}, {$set:req.body}, function(err, user){

     
     res.send({status:true, message:"profile updated successfully", profile:req.body});

   });
   
});



app.get('/profile/:Phone', function(req, res){
   

    if (req.params.Phone) {

          User.findOne({Phone:req.params.Phone}, function(err, plans){

          	if (plans) {

      
                res.send({status:true, data:plans});

          	}else{

          		res.send({status:false, message:"Profile not found"});
          	}

        
    });

    }else{

        res.send({status:false, message:"Phone required"});
    }
    
});



app.get('/user', function(req, res){

   
   var user = {
  user_id: '8383748',
  email: 'james@mail.com',
  first_name: 'James',
  last_name: "Nikon",
  phone_number: '234814677368',
  bvn: '22133388729',
}

rte.User.create(user, function(error, body){
  res.send(body);
});


})

app.get('/newtran', function(req, res){


var paystack = require('paystack')('SECRET_KEY');

paystack.transactions.verify({
  reference: 'T175382081781074'
}, function(error, body) {
  console.log(error);
  console.log(body);
});



})


app.get('/settings', isLoggedIn, function(req, res){


res.render('settings', {firstname:req.user.first_name, lastname:req.user.last_name});

});


    function isLoggedIn(req, res, next) {

   if (req.isAuthenticated())
    return next();

  res.redirect('/login');
};

 
};




            
  