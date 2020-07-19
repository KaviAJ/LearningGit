var Spouse = require('../models/spouse_events.js');
var Users = require('../models/user.js');

exports.profile = function(req,res){
		if(req.session.passport.user._id)
		{
			Users.findOne({ _id:req.session.passport.user.spouse_id}, function (err,couple) {
				var createdate = req.session.passport.user.createdAt; 
				var date = new Date(createdate);
				var ndate = date.toUTCString();
				var registered_date = ndate.replace(/GMT/g, "");
				if(err) throw err;
				else
				{
					 res.render('profile',{
						title:'User Profile',
						firstname:req.session.passport.user.firstname, 
					    lastname:req.session.passport.user.lastname ,
					    email:req.session.passport.user.email ,
					    city:req.session.passport.user.city ,
					    country:req.session.passport.user.country ,
					    address:req.session.passport.user.address ,
					    about_me:req.session.passport.user.about_me, 
					    role:req.session.passport.user.role, 
					    createdAt:registered_date,
					    profile_pic:req.session.passport.user.profile_pic,
					    spouse_details:couple,
					    profile_pic_message:req.flash('update_profile_success'),
					    update_success:req.flash('update_success'),

					});
				}
			});
		}
		else
		{
			res.redirect('/');
		}
}
