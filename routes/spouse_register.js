var Users = require('../models/user.js');
var md5 = require('md5');
exports.register = function(req,res){
	if(req.session.passport.user._id)
	{
		res.render('spouse_register',{
			title:'Spouse Register',
		});
	}
	else
	{
		res.redirect('/');
	}
		
}

exports.register_spouse = function(req,res){
	if(req.session.passport.user._id)
	{
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
		}
		
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
			    spouse_id:req.session.passport.user._id,
			});

			user_register.save(function(err) {
				if(err) throw err;
				else
				{	
					console.log("Spouse Registration Sucessful");
					req.flash('register_success', 'Spouse Registration Sucessful');

					Users.findOne({spouse_id:req.session.passport.user._id}, function (err,spouse_data){
						if(err) throw err;
						if(spouse_data._id)
						{
							req.session.passport.user.spouse_id = spouse_data._id
							Users.findOneAndUpdate({_id:req.session.passport.user._id},{$set: {spouse_id:spouse_data._id}},{upsert:true}, function (err,user_update){
								if(err) throw err;
								else
								{
									//console.log(user_update);
									console.log("User Profile Updated");
									req.flash('register_success', 'User Profile Updated');
								}
							});			
						}
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