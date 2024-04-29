const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
//const UserModel = require('../models/userModel');
const UserModel = require('../models/postgressql.userModel');
const { use, link } = require('../routes/authRoutes');
const { restart } = require('nodemon');
const responseUtils = require('../utils/responseUtils');
const candidatesRepository = require('../repositories/postgressql.candidatesrepository');
const express = require('express');
const bodyParser = require('body-parser');
const { json } = require('body-parser');
const app = express();
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
const validator = require('email-validator');
const { Console, error } = require('console');
const userRights = require('../middleware/authMiddleware');
const CandidatesController = {
  createCandidates: async (req, res) => {
    try {
      //To get code from Email-Link
      const code = req.params.code;
      const apiname = 'candidates';
      let access = await userRights.apiAccessRights(code, apiname);
      if (access != null) {
        console.log("Full User [ACCESS] Details->" + access);
        let toJson = access.toJSON();
        let strings = Object.values(toJson);
        let apiNameCheck = strings.find(item => item === 'datadelete');
        if (apiNameCheck) {
          // let response = await candidatesRepository.usersList();
          // let message = response.headers.message;
          // return responseUtils.returnStatusCodeWithMessage(res, 200,message );
        }
        else {
          responseUtils.returnStatusCodeWithMessage(res, 400, "You Are Not Authorized To Access This [SERVICE]");
        }
      }
      else {
        responseUtils.returnStatusCodeWithMessage(res, 400, "You Are Not Authorized To Access This [PAGE]");
      }

    }
    catch (error) {
      console.error(error);
    }
  },
  findAllCandidates: async (req, res) => {
    try {
      //To get code from Email-Link
      const code = req.params.code;
      //console.log(code);
      //let response = await candidatesRepository.(code, "emailVerification");
      let message = response.headers.message;
      responseUtils.returnStatusCodeWithMessage(res, 200, message);
      //}
    }
    catch (error) {
      console.error(error);
    }
  },
  findCandidatesById: async (req, res) => {
    try {
      //To get code from Email-Link
      const code = req.params.code;
      //console.log(code);
      //let response = await candidatesRepository.registerUser(code, "emailVerification");
      let message = response.headers.message;
      responseUtils.returnStatusCodeWithMessage(res, 200, message);
      //}
    }
    catch (error) {
      console.error(error);
    }
  },
  candidatesLogin: async (req, res) => {
    try {
      //To get code from Email-Link
      const code = req.params.code;
      //console.log(code);
      //let response = await candidatesRepository.registerUser(code, "emailVerification");
      let message = response.headers.message;
      responseUtils.returnStatusCodeWithMessage(res, 200, message);
      //}
    }
    catch (error) {
      console.error(error);
    }
  },
  candidatesSave: async (req, res) => {
    try {
      //To get code from Email-Link
      const code = req.params.code;
      //console.log(code);
      //let response = await candidatesRepository.registerUser(code, "emailVerification");
      let message = response.headers.message;
      responseUtils.returnStatusCodeWithMessage(res, 200, message);
      //}
    }
    catch (error) {
      console.error(error);
    }
  },
  candidatesDelete: async (req, res) => {
    try {
      const code = req.params.code;
      const apiname = 'candidatesDelete';
      let permissionFields = await userRights.apiAccessRights(code, apiname, 'datadelete');
      //console.log("permissionFields=>"+permissionFields);
      if (permissionFields != null) {
        //console.log("Have[ACCESS]->"+permissionFields);
        let toJson = permissionFields.toJSON();
        let strings = Object.values(toJson);
        //let apiNameCheck = strings.find(item => item === 'datadelete');
        if (strings) {
          console.log("DeleteAction Section");

          //let response = await candidatesRepository.deleteCandidate();
          //let message = response.headers.message;
          return responseUtils.returnStatusCodeWithMessage(res, 200, "Have Access");

        }
        else {
         // responseUtils.returnStatusCodeWithMessage(res, 400, "You Are Not Authorized To Access This [SERVICE]");
        }
      }
      else {
        responseUtils.returnStatusCodeWithMessage(res, 400, "You Are Not Authorized To Access This [SERVICE]");
      }

    }
    catch (error) {
      console.error(error);
    }
  },
  candidatesUpdate: async (req, res) => {
    try {
      const code = req.params.code;
      const apiname = 'candidatesUpdate';
      if (Object.keys(req.body).length == 0) {
        let permissionFields = await userRights.apiAccessRights(code, apiname);
        return responseUtils.returnStatusCodeWithMessage(res, 400, permissionFields);
      }
      if (Object.keys(req.body).length == undefined) {
        return responseUtils.returnStatusCodeWithMessage(res, 400, "You Are Not Authorized To Access This [SERVICE]");
      }
      if (Object.keys(req.body).length !== 0) {
        console.log("Have-Access");
        const full_name = req.params.word;
        let response = await candidatesRepository.updateCandidate(full_name, req.body);
        let message = response.headers.message;
        return responseUtils.returnStatusCodeWithMessage(res, 200, message);
      }
      // else
      //  {
      //   responseUtils.returnStatusCodeWithMessage(res, 400, "You Are Not Authorized To Access This [PAGE]");
      //  }

    }
    catch (error) {
      console.error(error);
    }
  },
};
//code to make and find from string
// let toJson = access.toJSON();
// let strings = Object.values(toJson);
// let apiNameCheck = strings.find(item => item === 'dataupdate');
// if(apiNameCheck)
// {
//}

module.exports = CandidatesController;