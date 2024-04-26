// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
//const UserModel = require('../models/userModel');
const UserModel = require('../models/postgressql.userModel');
const { use, link } = require('../routes/authRoutes');
const { restart } = require('nodemon');
const responseUtils = require('../utils/responseUtils');
const authRepository = require('../repositories/postgressql.authrepository');
const express = require('express');
const bodyParser = require('body-parser');
const { json } = require('body-parser');
const app = express();
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
const validator = require('email-validator');
const { Console, error } = require('console');
const userRights = require('../middleware/authMiddleware');
const AuthController = {

  signin: async (req, res) => {
    // Implement SignIn 
    try {
      const { user_name, password } = req.body;
      //console.log(user_name,password);
      if (!user_name==true) {
        return responseUtils.returnStatusCodeWithMessage(res, 400, 'Please Enter user_name!');
      }
      if (!password==true) {
        return responseUtils.returnStatusCodeWithMessage(res, 400, 'Please Enter Password!');
      }
      let response = await authRepository.userLogin(user_name, password);
      //console.log("response");
      let message = response.headers.message;
      let user_Name = response.body["user_name"];
      let token = response.body["token"];
      if (!response.body["user_name"])
       {
              responseUtils.returnStatusCodeWithMessage(res, 400, {"message": message});
      }
      else
      {
        responseUtils.returnStatusCodeWithMessage(res, 400,{"user_name": user_Name,"token": token,"message": message} );
      }
    }
    catch (err) {
      //responseUtils.returnStatusCodeWithMessage(res, 400, err);
      console.log(err);
    }

  },
  signup: async (req, res) => {
    // Implement registration logic
    try {
      //All fields are Checked and Validated Below    
      let { email, user_name, dob, address, password, mobile,userights } = req.body;
      //Email Verification Format checker
      let isEmailvalid = validator.validate(email);
      
      let existingUser = await UserModel.findByUserName(user_name);
      //console.log("existingUser->"+existingUser);
      if (!email == false && isEmailvalid == false) {
        return responseUtils.returnStatusCodeWithMessage(res, 400, 'Please Provide [A] Valid Email Address!');
      }
      
      if (!user_name == true) {
        return responseUtils.returnStatusCodeWithMessage(res, 400, 'Name is Missing');
      }
      if (!user_name == false && user_name.toString().length <= 3) {
        return responseUtils.returnStatusCodeWithMessage(res, 400, 'Name iS Too Short!');
      }
      if (!user_name == false && user_name.toString().length > 3 && !existingUser==false) {
         return responseUtils.returnStatusCodeWithMessage(res, 400, 'UserName Already Taken=> Kindly Use Another UserName');
      }
      if (!dob==true) {
        return responseUtils.returnStatusCodeWithMessage(res, 400, 'Date Of Birth => Is Missing');
      }
      if (!address==true) {
        return responseUtils.returnStatusCodeWithMessage(res, 400, 'Address is Missing');
      }
      if (!password==true) {
        return responseUtils.returnStatusCodeWithMessage(res, 400, 'Password is Missing');
      }
      if (!mobile==true) {
        return responseUtils.returnStatusCodeWithMessage(res, 400, 'Mobile-Number is Missing');
      }   
        if (!user_name == false && existingUser == null && isEmailvalid == true) {
        // Check if the user_name Exists as Same UserName cannot be created
         const convertedPassword = await bcrypt.hash(password, 10);
         let bodyData=[email,user_name,dob,address,convertedPassword,mobile,userights];
         let response = await authRepository.registerUser(bodyData, "sentForEmailVerification");
         //let response = await authRepository.registerUser(bodyData, "sentForEmailOtpVerification");
         //let response = await authRepository.registerUser(req.body, "sentForMobileOtpVerification");
         //let response = await authRepository.registerUser(email,user_name,dob,address,password,mobile, "sentForMobileOtpVerification");
          let message = response.headers.message;
          responseUtils.returnStatusCodeWithMessage(res, 201, message);
        }
      }
      catch(err)
    {
      //return 
      //responseUtils.returnStatusCodeWithMessage(res, 400,err);
      console.log(err);
    }
    },
  verifyEmail: async (req, res) => {
    try {
      //To get code from Email-Link
      const code = req.params.code;
      //console.log(code);
        let response = await authRepository.registerUser(code, "emailVerification");
        let message = response.headers.message;
        responseUtils.returnStatusCodeWithMessage(res, 200, message);
      //}
    }
    catch (error) {
      console.error(error);
    }
  },
  verifyEmailOtp: async (req, res) => {
    try {
      //To get code from Email-Link
      const code = req.params.code;
      //Code to Get emailVerificationCode From Db with other fields to copy to userTable
       let response = await authRepository.registerUser(code,'emailOtpVerification');
       let message = response.headers.message;
       console.log(message);
       responseUtils.returnStatusCodeWithMessage(res, 200, message);
      
    }
    catch (error) {
      console.error(error);
    }
  },
  verifyMobileOtp: async (req, res) => {
    try {
      //To get code from Email-Link
      const code = req.params.code;
      //Code to Get emailVerificationCode From Db with other fields to copy to userTable
       let response = await authRepository.registerUser(code,'mobileOtpVerification');
       let message = response.headers.message;
       console.log(message);
       responseUtils.returnStatusCodeWithMessage(res, 200, message);
      
    }
    catch (error) {
      console.error(error);
    }
  },
  usersList: async (req, res) => {
    try {
      //To get code from Email-Link
      const code = req.params.code;
      let access = await userRights.apiAccessRights(code);
      //Code to Get emailVerificationCode From Db with other fields to copy to userTable
      if(access=="usersList")
      {
        let response = await authRepository.usersList();
        //let message = response.headers.message;
        //responseUtils.returnStatusCodeWithMessage(res, 200, );
      }
       else
       {
        responseUtils.returnStatusCodeWithMessage(res, 400, "You Are Not Authorised To Access This [Page]");
       }
      
    }
    catch (error) {
      console.error(error);
    }
  },

};

module.exports = AuthController;
