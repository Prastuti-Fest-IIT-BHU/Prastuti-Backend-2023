const UserModel = require('../models/Users');
const EventModel = require('../models/Events');

// getting info about all users registered
const getAllUsers = async (req, res) => {
   try {
    const allusers = await UserModel.find();
    res.status(200).json(allusers);
    
   } catch (error) {
    res.status(404).json({message:error.message});
    
   } 
}

// getting info about email ids of all registered users
const getAllUsersEmail = async (req, res) => {
    const allUsers = await UserModel.find({});
    let userEmails = allUsers.map(user => {
        return user.email_id;
    })
    res.status(200).json({
        data: userEmails
    })
}

// checking if user exits
const getUser = async (req, res) =>{
    const user = await UserModel.find({_id:req.params.id});
    if (!user){
        res.status(404).send('User not found')
    }
    res.status(200).json(user);
}

// updating details of user
const editUser = async (req, res) =>{
    try {
        const user = await UserModel.findByIdAndUpdate(req.params.id , req.body, {
            new: true
        });
        res.status(200).json(user);
    }
    catch(err) {
        res.status(404).json({
            message: 'Event not found'
        });
    }
}


// checking if user participated in any event 
const eventUser = async (req, res) => {
    const event = await EventModel.findOne({
        Name: req.params.event
    });
    if(!event) {
        res.status(404).json({
            message: 'Event not found'
        });
    }
    let data;
    if(event.team_event) data = event.teams;
    else data = event.Participants;
    res.status(200).json({
        data
    })
}

module.exports = {getAllUsers, getUser, editUser, eventUser, getAllUsersEmail}
