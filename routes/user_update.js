var Spouse = require('../models/spouse_events.js');
var Users = require('../models/user.js');

exports.update = function(req,res){

	if(req.session.passport.user._id)
	{	
		var gender = req.body.gender;
		if(gender == 'Male')
		{
			var gen = 'Husband';
		}
		else
		{
			var gen = 'Wife';
		}	

		Users.findOneAndUpdate({_id:req.session.passport.user._id}
			,{ $set: 
				{username:req.body.username,
				email:req.body.email,
				firstname:req.body.firstname,
				lastname:req.body.lastname,
				city:req.body.city,
				address:req.body.address,
				about_me:req.body.about_me,
				role:gen},
			 }
			,{upsert:true}, function (err){
			if(err) throw err;
			else
			{
				Users.findOne({_id:req.session.passport.user._id},function (err,user_profile_update) {
					if(err) throw err;
					//console.log(user_profile_update);	
					console.log("User Profile Updated");
					req.flash('update_success', 'User Profile Updated');
					req.session.passport.user.firstname = user_profile_update.firstname 
				    req.session.passport.user.lastname = user_profile_update.lastname
				    req.session.passport.user.email = user_profile_update.email
					req.session.passport.user.city = user_profile_update.city
				    req.session.passport.user.country = user_profile_update.country
				    req.session.passport.user.address = user_profile_update.address
				    req.session.passport.user.about_me = user_profile_update.about_me 
				    res.redirect('/profile');
				});
			}
		});	

	}
	else
	{
		res.redirect('/');
	}
}

exports.update_profile_pic = function(req,res){

	if(req.session.passport.user._id)
	{	

		if (!req.files)
    		return res.status(400).send('No files were uploaded.');
    		let sampleFile = req.files.profile_pic;
    		console.log(sampleFile);
		
		  Users.findOneAndUpdate({_id:req.session.passport.user._id}
			,{$set:{profile_pic:req.files.profile_pic.name}}
			,{upsert:true}, function (err,user_profile_pic_update){
			if(err) throw err;
			else
			{
				sampleFile.mv('public/img/faces/'+req.files.profile_pic.name, function(err){
				    if (err)
				    return res.status(500).send(err);
				});
				
				console.log('Profile Pic Updated');
				req.session.passport.user.profile_pic = req.files.profile_pic.name;
				res.redirect('/profile');
			}
		});	
	}
	else
	{
		res.redirect('/');
	}
}

exports.task_status = function(req,res){
	if(req.session.passport.user._id)
	{
		Spouse.findOneAndUpdate({_id:req.body.event_id}
			,{$set:{task_status:1}}
			,{upsert:true}, function (err){
			if(err) res.status(400).json({ error: err });
			else
			{
				console.log('Event Started');
				res.json('Done');
			}
		});
		
	}	
}

exports.task_complete = function(req,res){
	if(req.session.passport.user._id)
	{
		Spouse.findOneAndUpdate({_id:req.body.event_id}
			,{$set:{task_status:2}}
			,{upsert:true}, function (err){
			if(err) res.status(400).json({ error: err });
			else
			{
				console.log('Task Completed');
				res.json('Done');
			}
		});
		
	}	
}

exports.delete = function(req,res){
	if(req.session.passport.user._id)
	{
		Spouse.findByIdAndRemove({_id:req.body.event_id},function (err){
			if(err) res.status(400).json({ error: err });
			else{
				console.log('Event Deleted');
				res.json('Done');
			}	
		});
		
	}	
}



