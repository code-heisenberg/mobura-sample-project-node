const http = require('http');
//const router = require('./router/routes')
const port = process.env.port || 3000;
//const server = http.createServer(router);
////
const express = require('express');
const dotenv = require('dotenv');
var mysql = require('mysql');
var bodyparser = require('body-parser');
var moment = require('moment');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var format = require('timestamp-format');
const { json } = require('body-parser');
const { connected } = require('process');
const { PRIORITY_BELOW_NORMAL, R_OK } = require('constants');
const { count } = require('console');
const { callbackify } = require('util');
const { appendFile } = require('fs');
const emailValidator = require('deep-email-validator');
const validator = require('email-validator');
const app = express();
dotenv.config()
//Db Connection Code Below
//app.use(express.static('public'));
//app.use(bodyparser.urlencoded({ extended: true }));
//app.use(bodyparser.json());
/*app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});*/

//SERVER LISTENING-PORT 
var APP_PORT = '3000'
// SQL-connec -STRiNG
app.use(express.json())
//Database Connection Area
var con = mysql.createConnection({
  // return mysql.createconnec({
  host: 'localhost',
  user: 'root',
  password: 'rooter1',
  database: 'shoppingcartal',
  port: '3306',
  /////////////////////////////
  
})
con.connect(function(err) {
  if (err)
  {
   console.log("Error While Connection")
   return 
  }
  
  console.log("Connected!");
  //EmailValidation Async Function
  const users = [];
  const press ={};
  var checkemail;
  var checkuser;
  var emailcount;
  var namecount;
  const salt =10
  //get api for all product list
  app.get('/product', (req, res) => {
    con.query('SELECT * FROM product', (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
  //get api for user sigin jwt validation
  app.get('/signin/id/validateToken', (req, res) => {
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    try {
      const token = req.header(tokenHeaderKey);

      const verified = jwt.verify(token, jwtSecretKey);
      if (verified) {
        con.query('SELECT * FROM user', (err, results) => {
          if (err) throw err;
          res.json(results);
         });
          return res.send("Successfully Verified");
      } else {
          // Access Denied
          return res.status(401).send(error);
      }
     } catch (error) {
      // Access Denied
      return res.status(401).send(error);
     }
     
    });
//post api for user login and jwt generation
app.post('/signin/id/generateToken', (req, res) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        time: Date(),
        userId: 12,
    }
    const token = jwt.sign(data, jwtSecretKey);
 
    res.send(token);
  con.query('INSERT INTO login (usercount,username,password,token) VALUES (?, ?,?,?,?,?)', [usercount,username,dob,passsword,token], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

//get api for all User List
app.get('/user', (req, res) => {
  con.query('SELECT * FROM user', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});
  //get api for all order list
  app.get('/orders', (req, res) => {
    con.query('SELECT * FROM orders', (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
  //User SingUp
   app.post('/signup',  (req, res, next)=>  {
    const { user_id,email,name,dob,address,password } = req.body;
     const emailid = req.body.email; 
     
    if(!emailid)
    {
      return res.status(400).send({
        message: "Email  Missing."
      })
    }
    if(!name)
    {
      return res.status(400).send({
        message: "Name Missing"
      })
    }
    if(!dob)
    {
      return res.status(400).send({
        message: "Date Of Birth Missing"
      })
    }
    if(!address)
    {
      return res.status(400).send({
        message: "Address Missing"
      })
    }
     //Email validation inbuilt Function validator
     isvalid = validator.validate(emailid);
     //Code Below to check Email Already Exits or Not
     con.query('SELECT COUNT(*) AS count FROM user WHERE email=?',[emailid], (err, results) => {
      if (err) throw err;
      
      emailcount = results[0].count;
      
      console.log("Count=>"+emailcount)
      //Code Below to insert New Emailid based User
      if (isvalid && emailcount==0)
      {
       var bycryptpassword = req.body.password
       bcrypt.hash(bycryptpassword.toString(),salt,(err,hash)=>{
        if(err)
        {
          console.log(err);
        }
        var bycrypted = hash;
        con.query('INSERT INTO user (user_id,email,name,dob,address,password) VALUES (?, ?,?,?,?,?)', [user_id,email,name,dob,address,bycrypted], (err, result) => {
          if (err) throw err;
          res.json({ message: 'User added successfully' });
        });

       }) 
       
       
       //return res.send({message: "User Details Registered"}
       //);
     }
     if(emailcount>0)
      {
       res.send({message: "Email Already Exits With Us"})
      }
 
 
     if(isvalid==false)
     {
     return res.status(400).send({
       message: "Please provide a valid email Address"
       
     })
 
   }
           
      
    });
    
              

    

    
  });
  
/////////
});







///Local Server Start Code
app.listen(port);

