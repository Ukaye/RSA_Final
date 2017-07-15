  var express       = require('express');
  var app           = express();
  var cors          = require('cors');
  var passport      = require('passport');
  var flash         = require('connect-flash');
  var session       = require('express-session');
  var cookieParser  = require('cookie-parser');
  var bodyParser    = require('body-parser');
  var handlebars    = require('express3-handlebars');
  var morgan        = require('morgan');


module.exports = function(app){



	app.set('view engine', 'html');

  app.engine('html', require('ejs').renderFile);

	app.set('views', __dirname + '/views');

	app.use(express.static(__dirname + '/public'));




    app.use(cors());
   	app.use(bodyParser.urlencoded({ extended: true }));
  	app.use(bodyParser.json());
	  app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.use(morgan('dev'));
 
};




            
  