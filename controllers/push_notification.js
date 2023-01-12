
const notificationService = require("./notification_service")
const Events = require("../models/Events")

module.exports.notifyAllUsers = (req,res,next)=>{
    var message = {
        app_id : process.env.ONE_SIGNAL_APP_ID,
        content:{en:"First Notification"},
        included_segments : ["All"],
        content_available : true,
        small_icon:"",//prastuti icon
        data : {
            PushTitle : "Fluttter Notification"
        }

    }

    notificationService.sendNotification(message,(error,results)=>{
        if(error){
            return next(error);
        }

        return res.status(200).send({
            message:"Success!!",
            data:results
        })

    })

}

module.exports.notifyUsersOfEvent =async (req,res,next)=>{

    //get The list of playerIds in Events model.
    var event = await Events.findOne({"Name": req.body.event_name})

    var message = {
        app_id : process.env.ONE_SIGNAL_APP_ID,
        content:{en:"First Notification"},
        included_segments : ["included_player_ids"],
        included_player_ids : req.body.devices,//event.player_ids
        content_available : true,
        small_icon:"",//prastuti icon
        data : {
            PushTitle : "Private Notification"
        }

    }

    notificationService.sendNotification(message,(error,results)=>{
        if(error){
            return next(error);
        }

        return res.status(200).send({
            message:"Success!!",
            data:results
        })
        
    })

}