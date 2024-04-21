// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const UserModel = require('../models/userModel');
const { use, link } = require('../routes/authRoutes');
const { restart } = require('nodemon');
const sentEmailToken = require('../email/sentEmailToken');
const responseUtils = require('../utils/responseUtils');
const authRepository = require('../repositories/auth.repository');
const express = require('express');
const bodyParser = require('body-parser');
const { userLogins } = require('../models/userModel');
const { json } = require('body-parser');
const app = express();
app.use(bodyParser.json()); // Parse JSON bodies
//app.use(bodyParser.urlencoded({ extended: true }));
const AuthController = {

  signin: async (req, res) => {
    // Implement SignIn 
    try {
      const { userName, password } = req.body;
      if (!userName) {
        responseUtils.returnStatusCodeWithMessage(res, 400, 'Please Enter UserName!');
      }
      if (!password) {
        responseUtils.returnStatusCodeWithMessage(res, 400, 'Please Enter Password!');
      }
      let response = await authRepository.userLogin(userName, password);
      let message = response.headers.message;
      let user_Name = response.body["userName"];
      let token = response.body["token"];
      if (!response.body["userName"])
       {
      let jsonFormatData={"user_Name":user_Name,"token":token,"message":message}      
        responseUtils.returnStatusCodeWithMessage(res, 400, jsonFormatData);
      }
      else
      {
        responseUtils.returnStatusCodeWithMessage(res, 400, jsonFormatData);
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
          let emailVerificationCode = uuid.v4();
          authRepository.registerUser(req.body, emailVerificationCode, "sentForVerificationCode");
          sentEmailToken.sendEmail(email, emailVerificationCode);
          responseUtils.returnStatusCodeWithMessage(res, 201, 'An Email Sent To Your Email-Id :=> Kindly Click The Link Inside Email To Complete Email-Verification!');
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
          responseUtils.returnStatusCodeWithMessage(res, 400, 'UserName Already Taken=> Kindly Use Another UserName');
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
      //Code to Get emailVerificationCode From Db with other fields to copy to userTable
      let userdetails = await UserModel.findByEmailVerificationCode(code);
      //Email Verifivation Done Here       
      if (userdetails.emailverificationcode == code) {
        //Already Password is Encrypted in userTemp Table,So Here No Need To Encrypt  
        let detailsUser = [userdetails.user_id, userdetails.email, userdetails.userName, userdetails.dob, userdetails.address, userdetails.password, userdetails.mobile];
        authRepository.registerUser(detailsUser, "null", "verified");
        responseUtils.returnStatusCodeWithMessage(res, 200, 'Email Verified & User Added Successfully=>Thanks For SignUp');
      }
    }
    catch (error) {
      console.error(error);
    }
  }

};

module.exports = AuthController;