var Spouse = require('../models/spouse_events.js');
var Users = require('../models/user.js');
var weekday = require('weekday');
var currenTime = require('current-time');

exports.tasks = function(req,res){
		if(req.session.passport.user._id)
		{
			var currentDay = weekday();
			// var time = currenTime('Perl');
			currenTime('Perl').then(data => {
    			console.log(data);
    		});	
			var query1 = { _id:req.session.passport.user.spouse_id};
			Users.findOne(query1, function (err,couple) {
				if(err) throw err;
				var query2 = {viewer_id:req.session.passport.user._id,days:currentDay};
				Spouse.find(query2, function (err,spouse_tasks) { 
					 //console.log(spouse_tasks);
					if(err) throw err;

					var query3 = {creator_id:req.session.passport.user._id};
					Spouse.find(query3,function(err,scheduled_tasks){
						res.render('tasks',{
							title:'User Events',
							firstname:req.session.passport.user.firstname, 
						    lastname:req.session.passport.user.lastname ,
						    role:req.session.passport.user.role, 
						    spouse_details:couple,
						    profile_pic:req.session.passport.user.profile_pic,
						    viewer_tasks:spouse_tasks,
						    scheduled_tasks:scheduled_tasks,
						    event_schedule_message:req.flash('schedule_success')
						});
					});
				});
			});
		}
		else
		{
			res.redirect('/');
		}
}