var mongoose = require('mongoose');
var Schema=mongoose.Schema;
//Schema
var UserEvents = new Schema({
    creator_id		 : {type: String, index: true},
    event_name       : {type: String, unique: true,index: true},
    event_description: {type: String,index: true},
    viewer_id        : {type: String,index: true},
    task_status      : {type: Number, index: true},
    createdAt        : {type: Date, index: true,default: Date.now},
    start_time       : {type: String, index:true},
   	end_time         : {type: String, index:true},
   	days             : {type: Array,index:true},
   	start_date	     : {type: Date,index:true},
   	end_date		 : {type: Date,index:true}
});

module.exports = mongoose.model('Spouse_Events',UserEvents);

