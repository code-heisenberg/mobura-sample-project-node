const jwt = require('jsonwebtoken');
const { Module } = require('module');
const { decode } = require('punycode');
const userModel = require('../models/postgressql.userModel');

  apiAccessRights = async(code)=> {
     let userRights = null;
      try {
        //Jwt-Token
          jwt.verify(code, 'SECRET_KEY',async (err, decoded) => {
        let user = decoded.username;
          if (err) {
            return { Error: 'Unauthorized: Invalid Token' };
          }
          if(!err)
          {
            //Api Right Checking And Passing Status
          console.log("Token Authorized");
          }    
          userRights = await userModel.usersRights(user);
          
        });
        
      } 
      catch (error) {
        console.error('Error fetching user names:', error);
        throw error; // Rethrow the error to handle it in the caller
      }  
      return userRights;
    };
module.exports = {apiAccessRights};


