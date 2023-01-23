const express = require('express');
const Router = express.Router();
const {getAllUsers, getUser, editUser, eventUser, getAllUsersEmail} = require("../controllers/user")
const {createTeam, getTeam, getTeamNames} = require("../controllers/team")
const { getAllEvents, getEvent }= require("../controllers/events");
const { getLeaderboard, getEventLeaderboard } =require("../controllers/leaderboard");
const { loginUser } = require("../controllers/login");
const { register_solo, register_team } = require("../controllers/register");
const { deleteRequest, sendRequest, acceptRequest, getRequest } = require("../controllers/request");
const { solo_score,score_team } = require("../controllers/score")
const {notifyAllUsers, notifyUsersOfEvent} = require("../controllers/push_notification")
// need to get all the functions from controller

// login and signup
Router.route('/login').get().post(loginUser);

// making a user and getting all users
Router.route('/user/:id').get(getUser).put(editUser);//individual
Router.route('/user').get(getAllUsers);//all users
Router.route('/user/:EventName').get(getEvent);//all users in event

//notificationServices:
Router.route("/sendNotification").post(notifyAllUsers)
Router.route("/sendNotificationForEvent").post(notifyUsersOfEvent)

// teams posting and getting
Router.route('/teams').post(createTeam);//post
Router.route('/teams/:id').get(getTeam);//get
Router.route('/teams').get(getTeamNames);//getting info of teams

// registering for event
Router.route('/soloRegistration').post(register_solo);//individual
Router.route('/teamRegistration').post(register_team);//team

// getting all events and particular event

Router.route('/events').get(getAllEvents);//all events
Router.route('/events/:id').get(getEvent);//particular event


// getting leaderboard 
Router.route('/leaderboard').get(getLeaderboard);
Router.route('/leaderboard/:event').get(getEventLeaderboard); //get leaderboad of a particular event.

// get score of all teams and individual person
Router.route('/soloScore').get(solo_score);//solo
Router.route('/teamScore').get(score_team);//team

// getting all requests of a user
Router.route('/request').post(sendRequest).delete(deleteRequest);
Router.route('/request/accept').post(acceptRequest);
Router.route('/request/:id').get(getRequest);
module.exports = Router;
//comment
