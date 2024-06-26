const express = require('express');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { structureResponse } = require('../utils/common.utils');
//const { sendOTPEmail } = require('../utils/sendgrid.utils');
const otpGenerator = require('otp-generator');
const hashPassword = require('../configs/passwordEncrypt');
//const { Config } = require('../configs/config');
//const hashedPassword = require('../configs/passwordEncrypt');
const UserModel = require('../models/postgressql.userModel');
const bodyParser = require('body-parser');
//const existingUserok = require('../controllers/authController');
const emailVerifications =require('../email/emailVerificationSystem');
const mobileOtpVerifications =require('../email/mobileOtpVerification');
const emailOtp=require('../email/emailOtp');
const uuid = require('uuid');
const app = express();
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));

const {
    RegistrationFailedException,
    InvalidCredentialsException,
    TokenVerificationException,
    OTPExpiredException,
    OTPGenerationException,
    OTPVerificationException
} = require('../utils/exceptions/auth.exception');
const {
    NotFoundException,
    UpdateFailedException,
    UnexpectedException
} = require('../utils/exceptions/database.exception');
const AuthController = require('../controllers/authController');
const { json } = require('body-parser');
const { get } = require('../routes/authRoutes');
class AuthRepository {
    registerUser =  async (body,emailCodeStatus,mobile) => {
        //const { email, user_name, dob, address, password, mobile, } = body;
        // Email-OTP Verifications Done Below
        //console.log("AuthRepo-->"+body);
        try
        {
        let emailotp =[];
        if(emailCodeStatus=="sentForEmailOtpVerification")
        {   emailotp = emailOtp.sendEmailOtp('prince.mobura@gmail.com');
            if (!emailotp || Date.now() > emailotp.expiry) {
                console.log("otp timeOut");
                return res.status(400).send('OTP expired or invalid');
            }
          let result = await UserModel.createUser_Temp(body[0],body[1],body[2],body[3],body[4],body[5],null,emailotp.otp,emailotp.expiry);
          return structureResponse({'user_name':"",'With-OTP':""}, 1,'Email-OTP Verification is Pending' );
        }
        // Verify OTP
        if(emailCodeStatus=="emailOtpVerification")
        {
           let userdetails = await UserModel.findByEmailVerificationOtp(body);
        if ( body == userdetails.emailotp) {
            // Success: OTP matched
            let detailsUser = [userdetails.email, userdetails.user_name, userdetails.dob, userdetails.address, userdetails.password, userdetails.mobile];
            const result =  await UserModel.createUsers(detailsUser[0],detailsUser[1],detailsUser[2],detailsUser[3],detailsUser[4],detailsUser[5]);
           return structureResponse({'user_name':userdetails.user_name,'With-OTP':userdetails.emailotp}, 1,'Email-OTP [Verified] & User Added Successfully=>Thanks For SignUp' );
        } 
    }
        //Email-Verification By Sending Link To User
        if(emailCodeStatus=="sentForEmailVerification")
        {
            let bodyDataExtract = [body[0],body[0]];
            //console.log(bodyDataExtract);
            //console.log(body.email);
            let emailverificationcode = uuid.v4();
            let emailVerification = emailVerifications.sendEmail('prince.mobura@gmail.com',emailverificationcode);
            let result = await UserModel.createUser_Temp(body[0],body[1],body[2],body[3],body[4],body[5],emailverificationcode,null,null);
            return structureResponse({'user_name':"",'With-OTP':""}, 1,'Email-Link Verification Pending or In Process' );
        }
        if(emailCodeStatus=="emailVerification")
        {
            //console.log("Eneter Email Verification ");
            let userdetails = await UserModel.findByEmailVerificationLink(body);
            //console.log("userdetails=>"+userdetails);
            if(userdetails.emailverificationcode == body)
            {
            let detailsUser = [userdetails.email, userdetails.user_name, userdetails.dob, userdetails.address, userdetails.password, userdetails.mobile];
            const result =  await UserModel.createUsers(detailsUser[0],detailsUser[1],detailsUser[2],detailsUser[3],detailsUser[4],detailsUser[5]);
            return structureResponse({'user_name':detailsUser[1],'EmailVerificationCode':userdetails[7]}, 1,'Email [Verified] & User Added Successfully=>Thanks For SignUp' );
            }
        }
        //Mobile-Otp Verification
        
        if(emailCodeStatus=="sentForMobileOtpVerification")
        {
            let mobileOtp = await mobileOtpVerifications.generateOTP(mobile);
            let optmobile = mobileOtp.token;
            let greeks = mobileOtp.otp;
            const convertedPassword = await bcrypt.hash(body.password, 10);
            let token = await jwt.sign({greeks}, 'SECRET_KEY', { expiresIn: '35m' });
            let result = await UserModel.createUser_Temp(body.email,body.user_name,body.dob,body.address,convertedPassword,body.mobile,undefined,token,mobileOtp.otp);
            
                                    
            return structureResponse({'user_name':"",'token':""}, 1,'Mobile-Otp Verification Pending or In Process' );
             
        }
        if(emailCodeStatus=="mobileOtpVerification")
        {
            
            let userdetails = await UserModel.findByMobileOtpCode(body);
            let greeks = userdetails.emailotp;
            const jwttoken = await jwt.verify(greeks, 'SECRET_KEY');
            console.log('jwttoken=>'+ JSON.stringify(jwttoken));
             if(jwttoken.greeks == body)
             {
               let detailsUser = [userdetails.email, userdetails.user_name, userdetails.dob, userdetails.address, userdetails.password, userdetails.mobile];
               const result =  await UserModel.createUsers(detailsUser[0],detailsUser[1],detailsUser[2],detailsUser[3],detailsUser[4],detailsUser[5]);
               return structureResponse({'user_name':userdetails.user_name,'With-OTP':""}, 1,'Mobile-OTP [Verified]=> You Are Now Part Of The System' );
             }
        }
      }
    catch(err)
    {   
        console.log(err);
    }
    }
    userLogin = async (user_name,password) => {
    //// Check if the password is correct
    try
    {
    let user = await UserModel.findByUserName(user_name);
    //console.log(user["user_name"],user.user_name);
    //console.log(user);
    if(!user==false)
    {
    //// Check if the password is correct
    let passwordMatch = await bcrypt.compare(password, user.password);
    //jwt Token User Sign-In after Password - Match
    if(user_name==user.user_name && passwordMatch==true)
    {
        let username = user.user_name;
        let token = jwt.sign({ username }, 'SECRET_KEY', { expiresIn: '5h' });
        // if(jwt.verify(tokens, 'SECRET_KEY'))
        // {
        //     console.log("Token-Verified=>");
        // }
        UserModel.userLogin(user_name,token);
        return structureResponse({'user_name':user_name,'token':token}, 1, 'Logged-IN SuccessFully');
    }
    }
        return structureResponse({'user_name':'','token':''}, 1, 'Password Mis-Macth');
    }
 catch(Error)
{
    //return structureResponse({'user_name':'','token':''}, 1, Error);
    console.log(Error);
}
 }
 usersList = async () => {
    //// Check if the password is correct
    try
    {
        let allUserList = await userModel.usersList() ;
            //console.log(allUserList);
        if(!allUserList==true)
        {
            return structureResponse({'user_name':'','token':''}, 1, 'No Users Found [Currently!]');
        }
        if(!allUserList==false)
        {
            console.log(allUserList);
            let message="ALL USERS List=>"+allUserList;
            return structureResponse({'user_name':'','token':''}, 1,message)
            
            
        }
        
    }
    catch(Error)
    {
            console.log(Error);
    }
}


};
module.exports = new AuthRepository;