const Users = require("../models/Users");
const Events = require("../models/Events");
const Team = require("../models/Teams");

// solo score on route '/score'
const solo_score = async(req, res) => {
  try {const { score } = req.body;
  const event = await Events.findOne({ Name: req.body.event_name });
  const user = await Users.findOne({ email_id: req.body.user_mail });


  //checking existance of user and event in application's database
  if(!event || !user) {
    res.status(404).json({
        status: 'Fail',
        message: 'User or Event not found'
    })
    return;
}

  if(event.team_event) {
    res.status(404).json({
        status: 'Fail',
        message: 'This is a team event'
    })
    return;
}

  //checking if user has registered for event or not
  const check = event.Participants.find(x => x.participant._id.equals(user._id));
    if(!check) {
        res.status(404).json({
            status: 'Fail',
            message: 'User not registered for this event'
        })
        return;
    }

  //Update total score in user
  user.Total_Score += score;
    user.save();

  //Update score in event's model
  let participant_present = event.Participants.find(x => x.participant._id.equals(user._id))
    participant_present.Score += score;
    event.save();

    res.status(200).json({
        message: 'Score updated'
    })
    
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
  
};


//request handler on '/score/team'
const score_team = async (req, res) => {
  const { score } = req.body;
  const event = await Events.findOne({ Name: req.body.event_name });
  const team = await Team.findOne({ slug: req.body.team_slug });

  if (!event || !team) {
    res.status(404).json({
      status: "Fail",
      message: "Team or Event not found",
    });
    return;
  }

  if (!event.team_event) {
    res.status(404).json({
      status: "Fail",
      message: "This is an individual event",
    });
    return;
  }

  const check = event.teams.find((x) => x.team._id.equals(team._id));
  if (!check) {
    res.status(404).json({
      status: "Fail",
      message: "Team not registered for this event",
    });
    return;
  }
 

  team.Members.forEach(async (member) => {
    const curUser = await Users.findById(member._id);
    curUser.Total_Score += score;
    curUser.save();
  });

  let team_present = event.teams.find((x) => x.team._id.equals(team._id));
  team_present.score += score;
  event.save();

  res.status(200).json({
    message: "Score updated for team",
  });
};

module.exports = {
  solo_score,
  score_team,
};
