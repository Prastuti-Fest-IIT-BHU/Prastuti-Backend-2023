const { response } = require("express");
const res = require("express/lib/response");
const { OAuth2Client } = require("google-auth-library");

const Users = require("../models/Users");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const loginUser = async (req, res) =>{
  const tokenId = req.body.tokenId;
  console.log(tokenId);
  let isNew = false; 
  let user = {};
  async function verify() {
      const ticket = await client.verifyIdToken({
          idToken: tokenId,
          audience: process.env.GOOGLE_CLIENT_ID
      })
      const payload = ticket.getPayload();
      console.log(payload);
      const curUser = await Users.findOne({
          email_id: payload.email
      })

      if(!curUser) {
          isNew = true;
          let newUser = {
              Name: payload.name,
              email_id: payload.email,
              Profile_Photo: payload.picture,
              isFormFilled:false,
              Teams: [],
              App_id:" ",
              Pending_Requests: [],
              Events_Participated: []
          }
          user = await Users.create(newUser);
      }
      else user = curUser;
  }


  
  verify().then((data) => {
    res.json({
        message: 'Success',
        user,
        isNew
    })
}).catch(err => 
  {  console.log("error bro");
    res.json({
    message: err.meassage,
    error: err
})}) 
}

module.exports = {loginUser};
