const Team = require("../models/Teams");
const Events = require("../models/Events");
const Users = require("../models/Users");

const register_solo = async (req, res) => {
  const user = await Users.findById(req.body.user_id);
  const event = await Events.findById(req.body.event_id);

  if (event.Team_Event) {
    res.json({
      status: "Fail",
      message: "Cannot register as an individual in team event",
    });
    return;
  }

  if (!user || !event) {
    return res.status(404).json({
      message: "User or event not found",
    });
    return;
  }

  // Check if already registered
  const eventFound = user.Events_Participated.find(
    (e) => e.Name === event.Name
  );
  if (eventFound) {
    res.json({
      message: "User already registered for this event",
    });
    return;
  }

  //Add event in User
  user.Events_Participated = user.Events_Participated.push(event._id);

  //Add User in Event
  event.Participants = event.Participants.push({
    participant: user._id,
    Score: 0,
  });

  //Increment no. of participants
  event.Participants_Count = event.Participants_Count + 1;

  //updating in db
  const updatedUser = await Users.findByIdAndUpdate(
    req.body.user_id,
    {
      Events_Participated: user.Events_Participated,
    },
    { new: true }
  );

  const updatedEvent = await Events.findByIdAndUpdate(
    req.body.event_id,
    {
      Participants: event.Participants,
      Participants_Count: event.Participants_Count,
    },
    { new: true }
  );

  res.status(201).json({
    message: "Registered Succeessfully",
  });
};

const register_team = async (req, res) => {
  const team = await Team.findById(req.body.team_id);
  const event = await Events.findById(req.body.event_id);
  const curUser = await Users.findById(req.body.user_id);

  if (!team || !event) {
    return res.status(404).json({
      status: "Fail",
      message: "Team or event not found",
    });
    return;
  }

  const isMember = team.Members.find((member) =>
    member._id.equals(curUser._id)
  );
  if (!isMember) {
    res.json({
      status: "Fail",
      message: "Only team member can register team",
    });
    return;
  }

  // Check if Team Event
  if (!event.Team_Event) {
    res.status(403).json({
      status: "Fail",
      message: "A team cannot be registered in a solo_event",
    });
    return;
  }

  // Check if already registered
  const eventExists = team.Events_Participated.find((e) =>
    e._id.equals(event._id)
  );
  if (eventExists) {
    res.json({
      message: "Team already registered for this event",
    });
    return;
  }

  async function checkUsersParticipation() {
    let check = 0;
    for (var i = 0; i < team.Members.length; i++) {
      const member = await Users.findById(team.Members[i]._id);
      if (
        member.Events_Participated.find((e) => {
          return e.Name === event.Name;
        })
      ) {
        check++;
      }
    }
    return check;
  }

  const check = await checkUsersParticipation();
  if (check > 0) {
    res.json({
      status: "Fail",
      message:
        "One or more user is already registered in the event with a different team",
    });
    return;
  }

  //Add a team in Event
  event.Teams.push({
    team: team._id,
    Score: 0,
  });
  event.Participants_Count = event.Participants_Count + team.Members.length;

  //Add Event in all Users
  await team.Members.forEach(async (member) => {
    let registeredUser = await Users.findById(member._id);
    registeredUser.Events_Participated.push(event._id);
    await Users.findByIdAndUpdate(
      registeredUser._id,
      {
        Events_Participated: registeredUser.Events_Participated,
      },
      {
        new: true,
      }
    );
  });

  //Add Event in Team
  team.Events_Participated.push(event._id);

  const updatedTeam = await Team.findByIdAndUpdate(
    req.body.team_id,
    {
      Events_Participated: team.Events_Participated,
    },
    { new: true }
  );
  const updatedEvent = await Events.findByIdAndUpdate(
    req.body.event_id,
    {
      Teams: event.Teams,
      Participants_Count: event.Participants_Count,
    },
    { new: true }
  );
  const updatedUser = await Users.findById(curUser._id);

  res.status(201).json({
    message: "Team registered successfully",
    updatedUser,
  });
};

module.exports = { register_solo, register_team };
