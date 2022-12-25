const express = require('express');
const Router = express.Router();

// need to get all the functions from controller

// login and signup
Router.route('/login').get().post();

// making a user and getting all users
Router.route('/user/:id').get().put();//individual
Router.route('/user').get();//all users
Router.route('user/:EventName').get();//all users in event

// teams posting and getting
Router.route('/teams').post();//post
Router.route('/teams/:id').get();//get

// registering for event
Router.route('/register/:EventName/:id').post();//individual
Router.route('/register/:EventName/:team').post();//team

// getting all events and particular event
Router.route('/events').get();//all events
Router.route('/events/:id').get();//particular event

// getting leaderboard of particular event
Router.route('/leaderboard/:event').get();

// get score of all teams and individual person
Router.route('/score').get();//solo
Router.route('/score/:team').get();//team

// getting all requests of a user
Router.route('/request/:id').get();
