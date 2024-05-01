const jwt = require('jsonwebtoken');
const { Module } = require('module');
const { decode } = require('punycode');
const util = require('util');
const candidateModel = require('../models/CandidatesModel');
const fieldValidations = require('../middleware/editValidationChecker');
const verifyAsync = util.promisify(jwt.verify);
const apiAccessRights = async (code, apiname,field) => {
  try {
    const decoded = await verifyAsync(code, 'SECRET_KEY');
    let user = decoded.username;
    console.log("Token Authorized for=>" + user);
    //const userRights = await candidateModel.usersRights(user,apiname,field);
    //return userRights;
    if (field) {
      const userupdate = await candidateModel.usersRights(user, apiname);
      //console.log("Candidate_Id Based Results=>"+userupdate); // Logging the user for debugging
      return userupdate;
    }
      if (!field) {
        const userupdate = await candidateModel.usersRights(user, apiname);
        const fieldChecker = fieldValidations.editValidations(code,apiname)
        if(fieldChecker)
        {
          return fieldChecker;
        }
        if(userupdate)
        {
          const userightsData = await candidateModel.returnUserRightsData(userupdate);
          const Permissions = await candidateModel.fieldWisePermissions(user,apiname,userupdate);
        //console.log("gotPermissions=>"+ JSON.stringify(gotPermissions));
        return Permissions;
        }
        else
        {
          return null
        }
                
      }

    } catch (error) {
      console.error('Error fetching user names:', error);
      throw error;
    }
  };
  module.exports = { apiAccessRights };


