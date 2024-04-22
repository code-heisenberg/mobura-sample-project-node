// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const UserModel = require('../models/userModel');
const { use, link } = require('../routes/authRoutes');
const { restart } = require('nodemon');
const sentEmails = require('../email/emailVerificationSystem');
const sendEmailOtp = require('../email/emailOtp');
const responseUtils = require('../utils/responseUtils');
const authRepository = require('../repositories/auth.repository');
const express = require('express');
const bodyParser = require('body-parser');
const { userLogins } = require('../models/userModel');
const { json } = require('body-parser');
const app = express();
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
const validator = require('email-validator');
const AuthController = {

  signin: async (req, res) => {
    // Implement SignIn 
    try {
      const { userName, password } = req.body;
      //console.log(userName,password);
      if (!userName) {
        responseUtils.returnStatusCodeWithMessage(res, 400, 'Please Enter UserName!');
      }
      if (!password) {
        responseUtils.returnStatusCodeWithMessage(res, 400, 'Please Enter Password!');
      }
      let response = await authRepository.userLogin(userName, password);
      //console.log(response);
      let message = response.headers.message;
      let user_Name = response.body["userName"];
      let token = response.body["token"];
      if (!response.body["userName"])
       {
              responseUtils.returnStatusCodeWithMessage(res, 400, {"message": message});
      }
      else
      {
        responseUtils.returnStatusCodeWithMessage(res, 400,{"user_Name": user_Name,"token": token,"message": message} );
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
      const { email, userName, dob, address, password, mobile, } = req.body;
      if (!email) {
        responseUtils.returnStatusCodeWithMessage(res, 400, 'Email Is Missing');
      }
      if (!email == false) {
        // Check if the userName Exists as Same UserName cannot be created
        const existingUser = await UserModel.findByUserName(userName);
        //Email Verification Format checker
        let isEmailvalid = validator.validate(email);
        //After Email Verification Format Checker. Code below to Send Email-Link To Verify Email
        if (isEmailvalid == true && existingUser == undefined) {
          //let response = await authRepository.registerUser(req.body, "sentForEmailOtpVerification");
          let response = await authRepository.registerUser(req.body, "sentForMobileOtpVerification");
          //let response = await authRepository.registerUser(req.body, "sentForEmailVerification");


          let message = response.headers.message;
           responseUtils.returnStatusCodeWithMessage(res, 201, message);
        }
        else if (isEmailvalid == false) {
          responseUtils.returnStatusCodeWithMessage(res, 400, 'Please Provide [A] Valid Email Address!');
        }
        
      }
      if (!userName) {
        await responseUtils.returnStatusCodeWithMessage(res, 400, 'Name is Missing');
      }
      if (!userName == false && userName.toString().length <= 3) {
        responseUtils.returnStatusCodeWithMessage(res, 400, 'Name iS Too Short!');
      }
      if (!userName == false && userName.toString().length > 3) {
        const existingUserName = await UserModel.findByUserName(userName);
        if (existingUserName) {
          return responseUtils.returnStatusCodeWithMessage(res, 400, 'UserName Already Taken=> Kindly Use Another UserName');
        }
      }
      if (!dob) {
        responseUtils.returnStatusCodeWithMessage(res, 400, 'Date Of Birth => Is Missing');
      }
      if (!address) {
        responseUtils.returnStatusCodeWithMessage(res, 400, 'Address is Missing');
      }
      if (!password) {
        responseUtils.returnStatusCodeWithMessage(res, 400, 'Password is Missing');
      }
      if (!mobile) {
        responseUtils.returnStatusCodeWithMessage(res, 400, 'Mobile-Number is Missing');
      }
    } catch (error) {
      console.error(error);

    }

  },
  verifyEmail: async (req, res) => {
    try {
      //To get code from Email-Link
      const code = req.params.code;
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
  }
};

module.exports = AuthController;
