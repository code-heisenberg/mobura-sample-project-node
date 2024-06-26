const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { structureResponse } = require('../utils/common.utils');
//const { sendOTPEmail } = require('../utils/sendgrid.utils');
const otpGenerator = require('otp-generator');
const hashPassword = require('../configs/passwordEncrypt');
//const { Config } = require('../configs/config');
//const hashedPassword = require('../configs/passwordEncrypt');
const UserModel = require('../models/CandidatesModel');
const OTPModel = require('../models/otp.model');
const express = require('express');
const bodyParser = require('body-parser');
//const existingUserok = require('../controllers/authController');
const emailVerifications =require('../email/emailVerificationSystem');
const mobileOtpVerifications =require('../email/mobileOtpVerification');
const emailOtp=require('../email/emailOtp');
const uuid = require('uuid');
const app = express();
//const CandidateController = require('../controllers/postgressql.candidatescontroller');
const { json } = require('body-parser');
const { get } = require('../routes/authRoutes');
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

//const userModel = require('../models/postgressql.userModel');
class candidatesRepository {
    createCandidate =  async (full_name,body) => {
        try
        {
            
            
        }
        catch(Error)
        {
                console.log(Error);
        }

    }
    deleteCandidate = async () => {
        //// Check if the password is correct
        try
        {
            
            
        }
        catch(Error)
        {
                console.log(Error);
        }
    }
    updateCandidate = async (full_name,body) => {
        //// Check if the password is correct
        try
        {
            let candidateUpdate = await UserModel.dataUpdate(full_name,body);
            if(candidateUpdate)
            {
                return structureResponse({'Candidate':'','Name':full_name}, 1,"Record Updated=> [Successfully]")
            }
                
        }
        catch(Error)
        {
                console.log(Error);
        }
    }

}
module.exports = new candidatesRepository;
