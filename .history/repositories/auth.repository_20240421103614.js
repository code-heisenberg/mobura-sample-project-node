const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { structureResponse } = require('../utils/common.utils');
//const { sendOTPEmail } = require('../utils/sendgrid.utils');
const otpGenerator = require('otp-generator');
const hashPassword = require('../configs/passwordEncrypt');
//const { Config } = require('../configs/config');
//const hashedPassword = require('../configs/passwordEncrypt');
const UserModel = require('../models/userModel');
const OTPModel = require('../models/otp.model');
const express = require('express');
const bodyParser = require('body-parser');
const existingUserok = require('../controllers/authController');
const emailOtp=require('../email/emailOtp');
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
    registerUser =  async (body,emailverificationcode,emailCodeStatus) => {

        // Email-OTP Verifications Done Below
        let otp_Time =[];
        if(emailCodeStatus=="sentForVerificationCode")
        {
            otp_Time = emailOtp.sendEmailOtp('prince.mobura@gmail.com');
            if (!otp_Time || Date.now() > otp_Time.expiry) {
                console.log("otp timeOut");
                return res.status(400).send('OTP expired or invalid');
            }
            let tempuserdata = body;
          let result = await UserModel.tempCreateUser(tempuserdata.user_id,tempuserdata.email,tempuserdata.userName,tempuserdata.dob,tempuserdata.address,tempuserdata.password,tempuserdata.mobile,emailverificationcode,otp_Time.otp,otp_Time.expiry);
        }
        // Verify OTP
        if(emailCodeStatus=="verification")
        {
            
        let getOtp = await UserModel.findByEmailOtpCode(emailverificationcode);
        if ( emailverificationcode == getOtp.emailotp) {
            // Success: OTP matched
            // Remove user data after successful verification
            //res.send('Email-OTP verified successfully');
            let userdetails = await UserModel.findByEmailOtpCodeAllData(emailverificationcode);
            let detailsUser = [userdetails.user_id, userdetails.email, userdetails.userName, userdetails.dob, userdetails.address, userdetails.password, userdetails.mobile];
            const result =  await UserModel.createUser(detailsUser[0],detailsUser[1],detailsUser[2],detailsUser[3],detailsUser[4],detailsUser[5],detailsUser[6]);
           return structureResponse({'userName':"",'With-OTP':""}, 1,'Email Verified & User Added Successfully=>Thanks For SignUp' );
            
        } 
        if(emailCodeStatus=="sentForVerificationCode")
        {
        }
        if(emailCodeStatus=="verification")
        {
        }

            

        }}
    userLogin = async (userName,password) => {
    //// Check if the password is correct
    try
    {
    let user = await UserModel.findByUserName(userName);
    //console.log(user);
    if(user)
    {
        //// Check if the password is correct
    let passwordMatch = await bcrypt.compare(password, user.password);
    //jwt Token User Sign-In after Password - Match
    if(userName==user.userName && passwordMatch)
    {
        let token = jwt.sign({ userId: user.id }, 'SECRET_KEY', { expiresIn: '1h' });
        UserModel.userLogin(userName,token);
        return structureResponse({'userName':userName,'token':token}, 1, 'Logged-IN SuccessFully');
    }
   
    }
        return structureResponse({'userName':'','token':''}, 1, 'Invalid Credentials');
    }
 catch(Error)
{
    return structureResponse({'userName':'','token':''}, 1, Error);
}
        
   };
    refreshToken = async (body) => {
        const { email, password: pass, oldToken } = body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new InvalidCredentialsException('Email not registered');
        }

        const isMatch = await bcrypt.compare(pass, user.password);

        if (!isMatch) {
            throw new InvalidCredentialsException('Incorrect password');
        }
        // user matched!
        const secretKey = Config.SECRET_JWT;
        const { user_id } = jwt.decode(oldToken);
        if (user.user_id.toString() !== user_id){
            throw new TokenVerificationException();
        }
        const token = jwt.sign({ user_id: user.user_id.toString() }, secretKey, {
            expiresIn: '24h'
        });
        return structureResponse({ token }, 1, "Refreshed");
    };

    forgotPassword = async (body) => {
        let user = await UserModel.findOne(body); // body contains "email" : ...
        
        if (!user) {
            throw new InvalidCredentialsException('Email not registered');
        }
        
        await this.#removeExpiredOTP(user.user_id);

        const OTP = await this.#generateOTP(user.user_id, body.email);

        sendOTPEmail(user, OTP);

        return structureResponse({}, 1, 'OTP generated and sent via email');
    };

    #generateOTP = async (user_id, email) => {
        const OTP = `${otpGenerator.generate(4, { alphabets: false, upperCase: false, specialChars: false })}`;

        const OTPHash = await bcrypt.hash(OTP, 8);

        let expiration_datetime = new Date();
        expiration_datetime.setHours(expiration_datetime.getHours() + 1);

        const body = {user_id, email, OTP: OTPHash, expiration_datetime};
        const result = await OTPModel.create(body);

        if (!result) throw new OTPGenerationException();

        return OTP;
    };

    #removeExpiredOTP = async (user_id) => {
        const result = await OTPModel.findOne({user_id});

        if (result) { // if found, delete
            const affectedRows = await OTPModel.delete({user_id});

            if (!affectedRows) {
                throw new OTPGenerationException('Expired OTP could not be deleted');
            }
        }
    };

    verifyOTP = async (body) => {
        const {OTP, email} = body;
        let result = await OTPModel.findOne({email});

        if (!result) {
            throw new OTPVerificationException();
        }

        const {expiration_datetime, OTP: OTPHash} = result;

        if (expiration_datetime < new Date()) {
            throw new OTPExpiredException();
        }

        const isMatch = await bcrypt.compare(OTP, OTPHash);

        if (!isMatch) {
            throw new OTPVerificationException();
        }

        result = await OTPModel.delete({email});

        if (!result) {
            throw new OTPVerificationException('Old OTP failed to be deleted');
        }

        return structureResponse({}, 1, 'OTP verified succesfully');
    };

    changePassword = async (body) => {
        const { email, password, new_password } = body;
        const user = await UserModel.findOne({ email: email });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new InvalidCredentialsException('Incorrect old password');
        }

        let responseBody = { email: email, password: new_password };

        return this.resetPassword(responseBody);
    };

    resetPassword = async (body) => {
        await hashPassword(body);

        const { password, email } = body;

        const result = await UserModel.update({password}, {email});

        if (!result) {
            throw new UnexpectedException('Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        if (!affectedRows) throw new NotFoundException('User not found');
        else if (affectedRows && !changedRows) throw new UpdateFailedException('Password change failed');
        
        return structureResponse(info, 1, 'Password changed successfully');
    };
}
    
module.exports = new AuthRepository;