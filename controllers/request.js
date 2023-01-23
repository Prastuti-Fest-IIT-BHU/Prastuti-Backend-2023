const Requests = require("../models/Request");
const Users = require("../models/Users");
const Teams = require("../models/Teams");
const { findByIdAndUpdate } = require("../models/Users");

const getRequest = async (req, res) => {
  const request = await Requests.findById(req.params.id);
  res.status(200).json({
    request,
  });
};

const deleteRequest = async (req, res) => {
  const request = await Requests.findById(req.body.requestId);
  if (!request) {
    res.status(404).json({
      message: "Request not found",
    });
    return;
  }
  await Requests.findByIdAndDelete(req.body.requestId);

  //deleting from team ->Pending requests
  const team = await Teams.findById(request.team._id);
    await Teams.updateOne(
      { _id: request.team._id },
      { $pull: { Pending_Requests: request._id } },
      {
        new: true,
      }
    );

   await Users.updateOne(
       {_id: request.requested_to._id} ,
      { $pull: { Pending_Requests: request._id } },
      {
        new: true,
      }
    );
    const updatedUser = await Users.findByIdAndUpdate(request.requested_to._id);

    res.status(200).json({
      message:"Request Deleted Successfully!!",
      updatedUser
    })

};

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
      res.status(404).json({
        message: "Request has been already sent",
      });
      return;
    }
    if (team.Members.find((member) => member._id.equals(user._id))) {
      res.status(404).json({
        message: "Given user is already added to the team",
      });
      return;
    }

    if (team.Member_Count < 3) {
      //Save a new request to the database
      const request = new Requests({
        teamName: team.Team_Name, 
        team: req.body.team_id,
        requested_to: user._id,
        requested_from: req.body.user_id,
      });
      await request.save();

      //Add request to team

      const updatedTeam = await Teams.updateOne(
        { _id: req.body.team_id },
        { $push: { Pending_Requests: request._id } },
        {
          new: true,
        }
      );

      //Add request to user

      await Users.updateOne(
        { _id: user._id },
        { $push: { Pending_Requests: request._id } },
        {
          new: true,
        }
      );

      res.status(200).json({
        message: "Request sent succesfully",
        updatedTeam,
      });
    } else {
      res.status(404).json({
        message: "Team already full",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Error",
    });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const request = await Requests.findById(req.body.requestId);
    if (!request) {
      res.status(404).json({
        message: "Request not found",
      });
      return;
    }
    await Requests.findByIdAndDelete(req.body.requestId);

    const team = await Teams.findById(request.team._id);
    team.Members.push(request.requested_to._id);
    await Teams.findByIdAndUpdate(team._id, {
      Members: team.Members,
      Member_Count: team.Member_Count + 1,
    });

    await Teams.updateOne(
      { _id: request.team._id },
      { $pull: { Pending_Requests: request._id } },
      {
        new: true,
      }
    );
    await Users.updateOne(
      { _id: request.requested_to._id },
      { $pull: { Pending_Requests: request._id } },
      {
        new: true,
      }
    );

    if (team.Members.length === 3) {
      team.Pending_Requests.forEach(async (request) => {
        await Requests.findByIdAndDelete(request._id);
      });
    }

    const user = await Users.findById(request.requested_to._id);
    user.Teams.push(request.team._id);
    const updatedUser = await Users.findByIdAndUpdate(
      user._id,
      {
        Teams: user.Teams,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Accepted Request",
      updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Error",
    });
  }
};

module.exports = { deleteRequest, sendRequest, acceptRequest, getRequest };
