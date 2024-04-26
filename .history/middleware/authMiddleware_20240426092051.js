const jwt = require('jsonwebtoken');
const { decode } = require('punycode');
const userModel = require('../models/postgressql.userModel');

const verifyToken = (req, res, next) => {
  //const token = req.headers['authorization'];
  let code= req.params.code;
//console.log("Token=>from code"+code);
  if (!code) {
    return res.status(401).json({ error: 'Un-Authorized: No Token Provided' });
  }
  
  async function apiAccessRights(token)
    { 
      try {
        //Jwt-Token
          jwt.verify(code, 'SECRET_KEY', (err, decoded) => {
          let user = decoded;
          if (err) {
            return res.status(401).json({ Error: 'Unauthorized: Invalid Token' });
          }
          if(!err)
          {
          //apiAccessRights(user)
          next();
          //Api Right Checking And Passing Status
          let userRights = await userModel.usersRights(user);
          console.log(userRights);  
          return res.status(200).json({ Success: 'Authorized: Token--> Hurrey' });        
          }
        
         
        });
        
      } 
      catch (error) {
        console.error('Error fetching user names:', error);
        throw error; // Rethrow the error to handle it in the caller
      }
      
    }

};


module.exports = verifyToken;
