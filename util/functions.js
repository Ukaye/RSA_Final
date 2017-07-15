var nodemailer      = require('nodemailer');
var smtpTransport   = require('nodemailer-smtp-transport');
var hbs             = require('nodemailer-express-handlebars');
var User            = require('../database/models/user.js');
var request         = require('request');


var options = {
    viewEngine: {
        extname: '.hbs',
        layoutsDir: 'view/email/',
        defaultLayout : 'main',
        partialsDir : 'view'
    },
    viewPath: 'view',
    extName: '.hbs'
};


var SMS = function(phone, otp){
    var data = {
        username:'Riby123',
        password:'Riby123',
        sender  : "Riby Savers",
        recipient : phone,
        message   : "Your OTP confirmation code is "+otp
    };
    var url = "http://www.quicksms1.com/api/sendsms.php";
    request.post(url, {form:data});
};


var Create = function(){

var day =  new Date().getDate();
var year = new Date().getFullYear();
var month = new Date().getMonth();

var newdate = day+'-'+month+'-'+year;

return newdate;
};



var later = function(month){

var day =  new Date().getDate();

if (month + new Date().getMonth() > 11) {

var yholder = new Date().getFullYear();
var mholder = new Date().getMonth() + month;

var year =  yholder + 1;
var month = mholder - 12;

var newdate = day+'-'+month+'-'+year;

return newdate;

}else{

  var year = new Date().getFullYear();
var month = new Date().getMonth() + month;

var newdate = day+'-'+month+'-'+year;

return newdate;


}

};


var Charge = function(amount, ref, auth){

    callback =  function(errData, data){
    if(errData){
        
       response = {status:false, message:"error charging card"};
        return response;

    }else if (data.body.data.responsecode == "00") {

      console.log(data);

        response = {status:true, message:" charge succesfull"};

        return response;     

    }else{

      console.log(data);
      
    }

};

  flutterwave.Card.capture({
  amount: amount,
  currency: "NGN",
  trxreference: ref,
  trxauthorizeid: auth

} , callback)

}



var Email = function(email, code) {
     User.findOne({'email':email}, function(err, data){

    var transporter = nodemailer.createTransport(smtpTransport({
       service: 'Mailjet',
       auth: {
            user: 'c24b4a6a151621ec5de788e660371489',
           pass: '8df967c53170adc5a7cefeca4e1254d5'
       }
    }));

    transporter.use('compile', hbs(options));

      var mailOptions = {
          from      : 'Riby Savers <info@riby.me>',
          to        :  email,
          subject   : 'Email Verification',
          template  : 'mail',
          context  : {code : code }
      };
     transporter.sendMail(mailOptions, function(error, info){
          if(error){
            console.log(error);
          }else{
             console.log('Message sent: ' + info.response);
          }
      });
 });
};



 var zeropad = function (num, places) {
            var zero = places - num.toString().length + 1;
            return Array(+(zero > 0 && zero)).join("0") + num;
        }

module.exports = {
  SMS       :SMS,
  Email     :Email,
  genId     :zeropad,
  Create    :Create,
  later     :later
};