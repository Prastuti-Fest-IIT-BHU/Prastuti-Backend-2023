const mongoose = require("mongoose");
// imported user and team schema
const User = require("./Users");
const Team = require("./Teams");
const { type } = require("express/lib/response");

// declaring event schema
const EventSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    enum: {
      values: [
        "Consilium",
        "Codigo",
        "Cryptex",
        "Codigo",
        "Hackoverflow",
        "Recognizance",
        "Simulim",
      ],
      message: "Event name is not valid",
    },
  },
  Description: {
    type: String,
  },
  problemStatement: {
    type: String,
  },
  resourses: {
    type: String,
  },
  player_ids:[
    {
     type: String
    }
   ],
  timeline: [
    {
      Date: {
        type: String,
        required: true,
      },
      slot: {
        type: String,
        required: false,
      }
      ,
      title: {
        type: String,
        required: true,
      },
      is_completed: {
        type: Boolean,
        default: false,
      },
    }
  ],
  no_of_participants: {
    type: Number,
    required: true,
    default: 0,
  },
  team_event: {
    type: Boolean,
    required: true,
  },
  Participants: [
    {
      participant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      Score: Number,
    },
  ],
  teams: [
    {
      team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
      score: {
        type: Number,
        default: 0,
      },
    },
  ],
});

// exporting event schema
module.exports = Event = mongoose.model("event", EventSchema);
