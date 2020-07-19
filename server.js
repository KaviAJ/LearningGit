var express =  require('express');
var path = require('path');
var http = require('http');
var session = require('express-session');
var bodyparser = require('body-parser');
var md5 = require('md5');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn('/login');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var routes = require('./routes');
var user_profile = require('./routes/profile');
var user_tasks = require('./routes/user_tasks');
var user = require('./models/user');
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var Users = require('./models/user.js');
var spouse = require('./models/spouse_events.js');
var spouse_register = require('./routes/spouse_register');
var user_update = require('./routes/user_update');
var fileUpload = require('express-fileupload');
var app = express();

app.use(flash());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
 	done(null, user);
});

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  //cookie: { maxAge: 3000 }
}))
app.use(fileUpload());
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://Esfera:esfera456@ds133547.mlab.com:33547/esferasoft');  //live
mongoose.Promise = global.Promise;
const MongoStore = require('connect-mongo')(session);

 //Body Parser Middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
				username: 'email',
  				password: 'password'
			},
		    function(username, password, done) {
			    var pass = md5(password);
				var query = { email:username, password:pass};
				
				  	Users.findOne(query, function (err,user) {
				  	//console.log(user);	
				    if (err) { return done(err); }
				      
				    if (!user) {
				    	return done(null, false, { message :'Incorrect Username or Password' });
				    }
				      		
					return done(null, user);
								
				    });
				
		   }
	   ));


app.get('/',routes.login);
app.get('/dashboard',ensureLoggedIn,routes.dashboard);
app.get('/logout',ensureLoggedIn,routes.logout);
app.get('/profile',ensureLoggedIn,user_profile.profile);
app.get('/tasks',ensureLoggedIn,user_tasks.tasks);
app.post('/login', passport.authenticate('local', { successRedirect: '/dashboard',failureRedirect: '/',successFlash:'Welcome',failureFlash:true}));
app.post('/schedule_events',ensureLoggedIn,routes.schedule_events);
app.post('/register',routes.register);
app.get('/spouse_register',ensureLoggedIn,spouse_register.register);
app.post('/spouse_register',ensureLoggedIn,spouse_register.register_spouse);
app.post('/update_user',ensureLoggedIn,user_update.update);
app.post('/profile_pic_update',ensureLoggedIn,user_update.update_profile_pic);
app.post('/task_status',ensureLoggedIn,user_update.task_status);
app.post('/task_delete',ensureLoggedIn,user_update.delete);
app.post('/taskend_status',ensureLoggedIn,user_update.task_complete);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on Ejsport ' + app.get('port'));
});