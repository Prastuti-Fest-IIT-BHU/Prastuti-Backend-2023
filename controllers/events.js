const EventModel = require("../models/Events");

//sending info about all the events registered by user
const getAllEvents = async (req, res) => {
  const events = await EventModel.find({});

  res.status(200).json({ events });
};

//sending info about a particular event registered by user
const getEvent = async (req, res) => {
  const event = await EventModel.find(req.params.id);

  res.status(200).json({ event });
};

module.exports = { getAllEvents, getEvent };
