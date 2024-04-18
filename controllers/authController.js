// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const validator = require('email-validator');
const UserModel = require('../models/userModel');
const { use, link } = require('../routes/authRoutes');
const { restart } = require('nodemon');
const sentEmailToken = require('../email/sentEmailToken');
const responseUtils = require('../utils/responseUtils');
const AuthController = {

  signin: async (req, res) => {
    // Implement SignIn 
    const {  name, password } = req.body;
    if (!name==true && name.toString().length==0) {
         responseUtils.returnStatusCodeWithMessage(res,400,'Please ENTER Name => Name Cannot Be Blank');
      }
    if (!password==true && password.toString().length==0) {
     
       responseUtils.returnStatusCodeWithMessage(res,400,'Please Enter Password!');
      }
      // Check if the user is already registered
      let existingUserName = await UserModel.findByUserName (name);
      if (!existingUserName && !name==false) {
        return res.status(400).json({ error: 'Either User NOT Found [OR] iNVALID CREDENTiALS' });    
      }
     if(!name==false)
     { 
    //// Check if the password is correct
    let user = await UserModel.findByUserName(name);
    
    let passwordMatch = await bcrypt.compare(password, user.password);
    //jwt Token User Sign-In
    let token = jwt.sign({ userId: user.id }, 'SECRET_KEY', { expiresIn: '1h' });
    try
    { 
    //If password Matches Then => Code to delete userTemp Data of the Logged User
    //After that name and token is passed to front-end
    if(passwordMatch)
     { 
      await UserModel.deleteUser(user.name);
      await UserModel.userLogin(name,token);
      username=user.name;
      res.status(200).json({token,username});
      }
      else if (!passwordMatch) {
      responseUtils.returnStatusCodeWithMessage(res,400,'Invalid credentials');
     }
    
  }
  catch(err)
  {
    //return res.status(400).json({error:err});
    responseUtils.returnStatusCodeWithMessage(res,400,err);
  }
   }
  
  },
  signup: async (req, res) => {
    // Implement registration logic
    try {
    //All fields are Checked and Validated Below    
    const { user_id,email, name, dob, address, password,mobile,emailVerificationCode } = req.body;
    if (!email) {
      responseUtils.returnStatusCodeWithMessage(res,400,'Email Is Missing');
        
      }
      if(!email==false)
       {
        // Check if the userName Exists as Same UserName cannot be created
        const existingUser = await UserModel.findByUserName(name);
        
        let emailVerificationCode = uuid.v4();
        //Email Verification Format checker
        let isvalid = validator.validate(email);
        
        //After Email Verification Format Checker. Code below to Send Email-Link To Verify Email
        console.log(existingUser);
        if(isvalid==true && existingUser==undefined)
        {
          UserModel.tempCreateUser(user_id,email, name, dob, address, password,mobile,emailVerificationCode);
          sentEmailToken.sendEmail(email,emailVerificationCode);
          responseUtils.returnStatusCodeWithMessage(res,201,'An Email Sent To Your Email-Id :=> Kindly Click The Link Inside Email To Compelete Email-Verification!');
        }
        else if(isvalid==false)
        {
          responseUtils.returnStatusCodeWithMessage(res,400,'Please Provide [A] Valid Email Address!');
        }
         
       }
       if (!name) {
         await responseUtils.returnStatusCodeWithMessage(res,400,'Name is Missing');
      }
      if (!name==false && name.toString().length<=3) {
        responseUtils.returnStatusCodeWithMessage(res,400,'Name iS Too Short!');
        
      }
      if(!name==false && name.toString().length>3)
      {
        const existingUserName = await UserModel.findByUserName (name);
        if (existingUserName) {
            responseUtils.returnStatusCodeWithMessage(res,400,'UserName Already Taken=> Kindly Use Another UserName');
        }
      }
      if (!dob) {
        responseUtils.returnStatusCodeWithMessage(res,400,'Date Of Birth => Is Missing');
      }
      if (!address) {
        responseUtils.returnStatusCodeWithMessage(res,400,'Address is Missing');
      }
      if (!password) {
        responseUtils.returnStatusCodeWithMessage(res,400,'Password is Missing');
      }
      if (!mobile) {
        responseUtils.returnStatusCodeWithMessage(res,400,'Mobile-Number is Missing');
      }
     } catch (error) {
        console.error(error);
        
      }

  },
  verifyEmail: async (req, res) => {
    try
    {
     //To get code from Email-Link
    const code=req.params.code;
    //Code to Get emailVerificationCode From Db with other fields to copy to userTable
    const  userdetails= await UserModel.findByEmailVerificationCode(code)
    //Email Verifivation Done Here       
    if(userdetails.emailverificationcode==code)
    {
      //Already Password is Encrypted in userTemp Table,So Here No Need To Encrypt  
      await UserModel.createUser(userdetails.user_id,userdetails.email,userdetails.name,userdetails.dob,userdetails.address,userdetails.password,userdetails.mobile);
      responseUtils.returnStatusCodeWithMessage(res,200,'Email Verified & User Added Successfully=>Thanks For SignUp');
    }
  }
  catch (error) {
    console.error(error);
  }
}

};

module.exports = AuthController;
