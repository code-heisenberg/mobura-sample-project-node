// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const validator = require('email-validator');
const UserModel = require('../models/AllUserDatabaseOperations');
const { use } = require('../routes/authRoutes');
const { restart } = require('nodemon');
const sentEmailToken =require('d:/NodeTestExamples/shoppingcartal/email/sentEmailToken.js');

const AuthController = {
  signin: async (req, res) => {
    // Implement login logic
    const {  name, password } = req.body;
    if (!name) {
      return res.status(400).send({
        message: "Please Enter UserName!"
      })
    }
    if (!password) {
      return res.status(400).send({
        message: "Please Enter Password!"
      })
    }
      // Check if the user is already registered
      let existingUserName = await UserModel.findByUserName (name);
      if (!existingUserName) {
        return res.status(400).json({ error: 'Either User NOT Found [OR] iNVALID CREDENTiALS' });    
      }
      //// Check if the password is correct
      
      //res.status(500).json({ error: 'ENTERED CREDENTiALS NOT VALiD => KiNDLY RETRY' });
               
    let user = await UserModel.findByUserName(name);
    let passwordMatch = await bcrypt.compare(password, user.password);
    let token = jwt.sign({ userId: user.id }, 'SECRET_KEY', { expiresIn: '1h' });
    try
    { 
    if(passwordMatch)
     { 
     await UserModel.userLogin(name,token);
     username=user.name;
         res.status(201).json({token,username});
         
     }
     else if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
  }
  catch(err)
  {
    //return res.status(400).json({error:err});
  }

  },

  signup: async (req, res) => {
    // Implement registration logic
    const { user_id, email, name, dob, address, password,mobile,emailVerificationCode } = req.body;
    if (!email) {
        return res.status(400).send({
          message: "Email Is Missing"
        })
      }
      if(!email==false)
       {
         let emailVerificationCode = uuid.v4();
         sentEmailToken.sendEmail(email,emailVerificationCode);
         return res.status(200).send({
          message: "An Email Sent To Your Email-Id :=> Kindly Click The Link Inside Email To Compelete Email-Verification!"
        })
       }
       if (!name) {
        return res.status(400).send({
          message: "Name Is Missing"
        })
      }
      if (!name==false && name.toString().length<=3) {
        return res.status(400).send({
          message: "Name Is Too-> Short"
        })
      }
      if(!name==false && name.toString().length>3)
      {
        const existingUserName = await UserModel.findByUserName (name);
        if (existingUserName) {
          return res.status(400).json({ error: 'UserName Already Taken=> Kindly Use Another UserName' });
        }
      }
      if (!dob) {
        return res.status(400).send({
          message: "Date Of Birth Missing"
        })
      }
      if (!address) {
        return res.status(400).send({
          message: "Address Missing"
        })
      }
      if (!password) {
        return res.status(400).send({
          message: "Please Enter [A] Password of Your Choice"
        })
      }
      if (!mobile) {
        return res.status(400).send({
          message: "Please Enter [A] Valid Mobile->Number"
        })
      }
      
      //
      try {
        // Check if the userName Exists
        const existingUser = await UserModel.findByUserName(name);
        if (existingUser) {
          return res.status(400).json({ error: 'Email Already Exits With Us' });
        }
  
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        //Check Email Format Before SignUp
        let isvalid = validator.validate(email);
        // Create a new user

        if(isvalid==true)
        {
         await UserModel.createUser(user_id,email,name,dob,address,hashedPassword,mobile,emailVerificationCode);
         res.status(201).json({ message: 'User Added Successfully=>Thanks For SignUp' });
        }
        if(isvalid==false)
        {
          return res.status(400).send({
            message: "Please Provide [A] Valid Email Address" });
        }        
        
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed To Create User => Either Email Already Exists or Wrong Credentials' });
      }

  },
  

};

module.exports = AuthController;
