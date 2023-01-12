const mongoose = require("mongoose");
const slugify = require("slugify");

const userModel = require("./Users");
const requestModel = require("./Request");
const eventModel = require("./Events");

const TeamSchema = new mongoose.Schema({
        Team_Name : {
            type : String,
            unique : [true , "This Team Name is not available"],
            required : true
        },
        slug : String,
        Events_Participated : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'event'
        }],
        Members : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'user'
        }],
        Member_Count : {
            type : Number,
            required : true,
            max : [3 , "Max members allowed is 3"]
        },
        Pending_Requests : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'request'
        }]
});
 
TeamSchema.pre("save",function(next){
   this.slug = slugify(this.Team_Name,{
    lower :true

   });
   next();
})

TeamSchema.pre(/^find/,function(next){
    // this.populate({
    //     path : 'Events_Participated',
    //     select : '-Teams -Participants -__v'
    // });
    this.populate({
        path : 'Members',
        select : '-Teams -Pending_Requests -__v -Events_Participated -Phone -Total_Score'
    });
    // this.populate({
    //     path : 'Pending_Requests',
    //     select : '-__v'
    // });
    next();
})

const Team = new mongoose.model('team',TeamSchema);
module.exports = Team;