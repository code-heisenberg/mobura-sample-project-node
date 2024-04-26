const jwt = require('jsonwebtoken');
const { Module } = require('module');
const { decode } = require('punycode');
const userModel = require('../models/postgressql.userModel');
 
  apiAccessRights = async (code,res) => {
     
      //let user = null;
      try {
        //Jwt-Token
          jwt.verify(code, 'SECRET_KEY',async (err, decoded) => {
        let user = decoded;
          if (err) {
            return { Error: 'Unauthorized: Invalid Token' };
          }
          if(!err)
          {
          //apiAccessRights(user)
          //Api Right Checking And Passing Status
          }    
          let userRights = await userModel.usersRights(user);
          console.log(userRights);  
          return { Rights: userRights };      
        });
      } 
      catch (error) {
        console.error('Error fetching user names:', error);
        throw error; // Rethrow the error to handle it in the caller
      }  
           
      
    

};


module.exports = {apiAccessRights};

