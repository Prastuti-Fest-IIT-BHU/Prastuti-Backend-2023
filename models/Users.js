const mongoose = require("mongoose");
const teamModel = require("./Teams");
const eventModel = require("./Events");
const requestModel = require("./Request");

const UserSchema = new mongoose.Schema({
     Name : {
            type : String,
            required : [true, "Name is required"],
            trim : true,
     },
     email_id : {
        type : String,
        unique : [true, 'This email_id already exists'],
        required : [true, 'e-mail is required'],
        trim : true,
        validate : { 
            validator : function(input){
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input);
            },
            message : 'Please enter a valid email'
        }
     },
     is_form_filled:{
      type: Boolean,
     },
     College : {
        type : String
     },
     Profile_Photo : {
        type : String,
        default : 'https://ibb.co/9Gzy6Nj'
     },
     Phone : {
        type : Number
     },
     Gender:{
      type: String,
      enum: ['Male', 'Female', 'Other', 'None'],
     },
     Interests: {
      type:[String]
     },
     SocialMedia_Links: {
      type:[String]
     },
     App_id: {
      type:String,
     },
     isFormFilled:{
      type:Boolean
     },
     Teams : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'team'
     }],
     Pending_Requests : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'request'
     }],
     Total_Score : {
        type : Number,
        default : 0
     },
     Events_Participated : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'event' 
     }]
});

UserSchema.pre(/^find/,function(next){
    this.populate({
        path : 'Teams',
        select : '-__v'
    });
    this.populate({
       path : 'Pending_Requests',
       select : '-__v' 
    });
    this.populate({
        path : 'Events_Participated',
        select : '-__v'
    })
    next();
});

const User = mongoose.model('user',UserSchema);
module.exports = User;
