var Spouse = require('../models/spouse_events.js');
var Users = require('../models/user.js');
var md5 = require('md5');

//Function for user login
exports.login = function(req,res){
		
		res.render('login',{
			title:'User Login',
			register_success:req.flash('register_success'),
			login_error:req.flash('error'),

		});
}

exports.register = function(req,res){

		var password = req.body.password;
		var confirm_password = req.body.confirm_password;
		var gender = req.body.gender;
		if(gender == 'Male')
		{
			var gen = 'Husband';
		}
		else
		{
			var gen = 'Wife';
		}	

		if(password === confirm_password)
		{
			var pass = md5(password);
			//console.log(pass);
		}

		if (!req.files)
    		return res.status(400).send('No files were uploaded.');
    		let sampleFile = req.files.profile_pic;
    		console.log(sampleFile);

		var user_register = new Users({
				username:req.body.username,
			    email:req.body.email,
			    firstname:req.body.firstname,
			    lastname:req.body.lastname,
			    password:pass,
			    city:req.body.city,
			    country:req.body.country,
			    address:req.body.address,
			    about_me:req.body.about_me,
			    role:gen,
			    profile_pic:req.files.profile_pic.name,
			});

			user_register.save(function(err) {
				if(err) throw err;
				else
				{	
					sampleFile.mv('public/img/faces/'+req.files.profile_pic.name, function(err){
			        	if (err)
			           	return res.status(500).send(err);
			        	console.log('File uploaded!');
	        		});
					console.log("User Registered");
					req.flash('register_success', 'User Registered');
					res.redirect('/');

				}		
			});	
}

//Function for user dashboard
exports.dashboard = function(req,res){
		if(req.session.passport.user._id)
		{
			Spouse.find({creator_id:req.session.passport.user._id},function (err,cr_data) {	
				if(err) throw err;
				Spouse.find({viewer_id:req.session.passport.user._id},function (err,vi_data) {
					if(err)throw err;
					res.render('dashboard',{
						title:'User dashboard',
						user_address:req.session.passport.user.address,
						scheduled_events:cr_data,
						view_events:vi_data
					});
				});
			});
		}
		else
		{
			res.redirect('/');
		}
}

exports.logout = function(req,res){
	req.session.destroy(function(err) {
	  if(err) {
	    console.log(err);
	  } else {
	  	console.log('Logout');
	    res.redirect('/');
	    
	  }
	});

}

exports.schedule_events = function(req,res){
		if(req.session.passport.user._id)
		{	
			var days = [];
			days = req.body.event_check;
			var check = req.body.for_date_event;
			var start_time = req.body.start_time + req.body.start;
			var end_time = req.body.end_time + req.body.end;
			// console.log(start_time);
			// console.log(end_time);

			if(check == 'DateEvent')
			{	
				var spouse_tasks = new Spouse({
					event_name        : req.body.event_name,
					event_description : req.body.event_description,
					start_time        : start_time,
					end_time          : end_time,
					viewer_id         : req.body.viewer_id,
					creator_id        : req.session.passport.user._id,
					task_status       : 0,
					start_date		  : req.body.start_date,
					end_date 		  : req.body.end_date
				});
				//console.log(spouse_tasks);
				spouse_tasks.save(function(err) {
					if(err) throw err;
					else
					{	
						console.log("Event Scheduled");
						req.flash('schedule_success', 'Event Scheduled');
						res.redirect('/tasks');

					}		
				});
			}
			else
			{
				var spouse_tasks = new Spouse({
					event_name        : req.body.event_name,
					event_description : req.body.event_description,
					start_time        : start_time,
					end_time          : end_time,
					viewer_id         : req.body.viewer_id,
					creator_id        : req.session.passport.user._id,
					task_status       : 0,
					days			  : days	
				});
				//console.log(spouse_tasks);
				spouse_tasks.save(function(err) {
					if(err) throw err;
					else
					{	
						console.log("Event Scheduled");
						req.flash('schedule_success', 'Event Scheduled');
						res.redirect('/tasks');

					}		
				});			
			}
			
			
		}
		else
		{
			res.redirect('/');
		}
}