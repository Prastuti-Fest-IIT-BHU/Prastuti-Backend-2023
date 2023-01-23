const slugify = require('slugify');

const TeamModel = require('../models/Teams');
const UserModel = require('../models/Users');

// getting info about members of team
const getTeamNames = async (req, res) => {
    const teams = await TeamModel.find({});
    // let teamNames = teams.map(team => team.slug);
    res.status(200).json({
        teams
    })
}

// creating team and also checking for its validation
const createTeam = async (req, res) => {
    try {
        let user = await UserModel.findById(req.body.userID);
        if(!user) {
            res.status(404).json({
                message: 'User not found'
            })
            return;
        }
        const curSlug = slugify(req.body.Team_Name, {
            lower: true
        });
        const team = await TeamModel.findOne({slug: curSlug});
        if(team) {
            res.status(404).json({
                message: 'Team with this name already exists'
            })
            return;
        }
        const newTeam = await TeamModel.create({
            Team_Name: req.body.Team_Name,
            Events_Participated: [],
            Members: [req.body.userID],
            Member_Count: req.body.Member_Count,
            Pending_Requests: []
        });
        user.Teams.push(newTeam._id);
        let updatedUser = await UserModel.findByIdAndUpdate(req.body.userID, {
            Teams: user.Teams
        }, {
            new: true
        })
    
        res.status(200).json({
            message: 'New Team Created',
            data: {
                newTeam,
                updatedUser
            }
        })
    }
    catch(err) {
        console.log(err.message);
        res.status(404).json({
            message:err.message 
        })
    }
}

// checking for the team 
const getTeam = async (req, res) => {
    try {
        const team = await TeamModel.findById(req.params.id);
        res.status(200).json({
            team
        })
    }
    catch(err) {
        console.log(err);
        res.status(404).json({
            message: 'Error'
        })
    }
}

module.exports = {createTeam, getTeam, getTeamNames}