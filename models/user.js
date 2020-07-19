var mongoose = require('mongoose');
var Schema=mongoose.Schema;
//Schema
var UserSchema = new Schema({
    username:{type:String,index:true},
    email:{type: String, unique: true,index: true},
    firstname:{type: String,index: true},
    lastname:{type: String,index: true},
    password:{type: String, index: true},
    city:{type: String,index: true},
    country:{type: String,index: true},
    address:{type: String,index: true},
    about_me:{type: String,index: true},
    role:{type: String,index:true},
    createdAt: {type: Date, index: true,default: Date.now},
    spouse_id: {type:String,index:true},
    profile_pic:{type:String,index:true},

});

module.exports=mongoose.model('Couples',UserSchema);


 
