const Requests = require("../models/Request");
const Users = require("../models/Users");
const Teams = require("../models/Teams");

const getRequest = async (req, res) => {
  const request = await Requests.findById(req.params.id);
  res.status(200).json({
    request,
  });
};

const deleteRequest = async (req, res) =>{
  await Requests.findByIdAndDelete(req.body.requestId);
  res.status(200).json({
      message: 'Request Deleted'
  })
}

const sendRequest = async (req, res) => {
  try {
    const user = await Users.findOne({ email_id: req.body.recepient_email });
    const team = await Teams.findOne({ _id: req.body.team_id });
    if (!team || !user) {
      res.status(404).json({
        message: "Team or user not found.",
      });
      return;
    }

    const request = await Requests.findOne({
      team: req.body.team_id,
      requested_to: user._id,
    });
    if (request) {
      res.json({
        message: "Request has been already sent",
      });
      return;
    }
    if (team.Members.find((member) => member._id.equals(user._id))) {
      res.json({
        message: "Given user is already added to the team",
      });
      return;
    }

    if (team.Member_Count < 3) {
      //Save a new request to the database
      const request = new Requests({
        team: req.body.team_id,
        requested_to: user._id,
        requested_from: req.body.user_id,
      });
      await request.save();

      //Add request to team
     
      const updatedTeam =  await Teams.updateOne( 
        { _id: req.body.team_id}, 
        { $push: { Pending_Requests: request._id} },{
          new: true,
        } 
      )

      //Add request to user
      
      await Users.updateOne( 
        { _id: user._id}, 
        { $push: { Pending_Requests: request._id} },{
          new: true,
        } 
      )

      res.json({
        message: "Request sent succesfully",
        updatedTeam,
      });
    } else {
      res.json({
        message: "Team already full",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      message: "Error",
    });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const request = await Requests.findById(req.body.requestId);
    if(!request) {
        res.status(404).json({
            message: 'Request not found'
        });
        return;
    }
    await Requests.findByIdAndDelete(req.body.requestId);
    
    const team = await Teams.findById(request.team._id);
    team.Members.push(request.requested_to._id);
    await Teams.findByIdAndUpdate(team._id, {
        Members: team.Members,
        Member_Count: team.Member_Count + 1
    });

      await Teams.updateOne( 
        { _id: request.team._id}, 
        { $pull: { Pending_Requests: request._id} },{
          new: true,
        } 
      )
     await Users.updateOne( 
        { _id: request.requested_to._id}, 
        { $pull: { Pending_Requests: request._id} },{
          new: true,
        } 
      )
    
    if(team.Members.length === 3) {
        team.Pending_Requests.forEach(async (request) => {
            await Requests.findByIdAndDelete(request._id);
        })
    }
    
    const user = await Users.findById(request.requested_to._id);
    user.Teams.push(request.team._id);
    const updatedUser = await Users.findByIdAndUpdate(user._id, {
        Teams: user.Teams
    }, {
        new: true
    })

    res.json({
        message: 'Accepted Request',
        updatedUser
    });
}
catch(err) {
    console.log(err);
    res.json({
        message: "Error"
    })
}

};

module.exports = { deleteRequest, sendRequest, acceptRequest, getRequest };
