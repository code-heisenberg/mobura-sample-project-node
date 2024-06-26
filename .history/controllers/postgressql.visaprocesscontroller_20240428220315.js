const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
//const UserModel = require('../models/userModel');
const UserModel = require('../models/postgressql.userModel');
const { use, link } = require('../routes/authRoutes');
const { restart } = require('nodemon');
const responseUtils = require('../utils/responseUtils');
const candidatesRepository = require('../repositories/postgressql.visaprocessrepository');
const express = require('express');
const bodyParser = require('body-parser');
const { json } = require('body-parser');
const app = express();
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
const validator = require('email-validator');
const { Console, error } = require('console');
const userRights = require('../middleware/authMiddleware');
const VisaprocessController = {
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
  visaprocessSave: async (req, res) => {
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
  visaprocessDelete: async (req, res) => {
    try {
      const code = req.params.code;
      const apiname = 'candidatesDelete';
      let access = await userRights.apiAccessRights(code, apiname);
      if (access != null) {
        console.log("Full User [ACCESS] Details->" + access);
        let toJson = access.toJSON();
        let strings = Object.values(toJson);
        let apiNameCheck = strings.find(item => item === 'datadelete');
        if (apiNameCheck) {
          //let response = await candidatesRepository.deleteCandidate();
          let message = response.headers.message;
          return responseUtils.returnStatusCodeWithMessage(res, 200, message);
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
  visaprocessUpdate: async (req, res) => {
    try {
      const code = req.params.code;
      const action = req.params.word;
      const apiname = 'visaprocessUpdate';
      let access = await userRights.apiAccessRights(code, apiname, action);
      if (access) {
        console.log("Have-Access" + access);
        return responseUtils.returnStatusCodeWithMessage(res, 200, "Success");
      }
      
      if (!access) {
        return responseUtils.returnStatusCodeWithMessage(res, 400, "You Are Not Authorized To Access This [SERViCE]");
      }

      // else
      //  {
      //   responseUtils.returnStatusCodeWithMessage(res, 400, "You Are Not Authorized To Access This [PAGE]");
      //  }

    }
    catch (error) {
      return responseUtils.returnStatusCodeWithMessage(res, 400, "NO SUCH => [SERVICE] Available TO Access");
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

module.exports = VisaprocessController;