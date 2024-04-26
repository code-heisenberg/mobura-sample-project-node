const jwt = require('jsonwebtoken');
const { Module } = require('module');
const { decode } = require('punycode');
const userModel = require('../models/postgressql.userModel');
 
  apiAccessRights = async (code,res) => {
     
      let user = null;
      try {
        //Jwt-Token
          jwt.verify(code, 'SECRET_KEY',async (err, decoded) => {
          user = decoded;
          if (err) {
            return res.status(401).json({ Error: 'Unauthorized: Invalid Token' });
          }
          if(!err)
          {
          //apiAccessRights(user)
          //Api Right Checking And Passing Status
          }    
        
        });
      } 
      catch (error) {
        console.error('Error fetching user names:', error);
        throw error; // Rethrow the error to handle it in the caller
      }  
           
      let userRights = await userModel.usersRights(user);
      console.log(userRights);  
      return res.status(200).json({ Success: 'Authorized: Token--> Hurrey' });      
    

};


module.exports = {apiAccessRights};

