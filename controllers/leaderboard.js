const Event = require("../models/Events");
const Users = require("../models/Users");

//sending info about a particular event "/leaderboard/:name"
const getEventLeaderboard = async (req, res) => {
  const eventName = req.params.event;
  const event = await Event.findOne({ Name: eventName });

  if (!event.team_event) {
    let data = event.Participants.map(async(user) => {
      const curUser = await Users.findById({_id: user.participant});
      return {
        Name: curUser.Name,
        College: curUser.College,
        Score: user.Score,
        ProfileImg: curUser.Profile_Photo,
      };
    });
    data.sort((a, b) => b.Score - a.Score);
    res.status(200).json({
      data,
      teamEvent: false,
    });
  } else {
    let data = event.Teams.map((Team) => {
      let members = Team.team.Members.map((member) => member.Name);
      return {
        Name: Team.team.Team_Name,
        Score: Team.Score,
        members,
      };
    });
    data.sort((a, b) => b.Score - a.Score);
    res.status(200).json({
      data,
      teamEvent: true,
    });
  }
};

//sending info when user request at '/leaderboard'
const getLeaderboard = async (req, res) => {
  const users = await Users.find({})
    .sort("-Total_Score")
    .select("-Phone -Pending_Requests -_id -__v -Teams");

  let data = users.map((user) => {
    return {
      Name: user.Name,
      Score: user.Total_Score,
      College: user.College,
      NumEvents: user.Events_Participated.length,
    };
  });

  res.status(200).json({ data });
};

module.exports = { getLeaderboard, getEventLeaderboard };
