const http = require('http');
//const router = require('./router/routes')
const port = process.env.port || 3000;
//const server = http.createServer(router);
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
const { count, time } = require('console');
const { callbackify } = require('util');
const { appendFile } = require('fs');
const emailValidator = require('deep-email-validator');
const validator = require('email-validator');
const app = express();
dotenv.config()
//Db Connection Code Below
//app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
con.connect(function (err) {
  if (err) {
    console.log("Error While Connection")
    return
  }
  console.log("Connected!");
  //EmailValidation Async Function
  const users = [];
  const press = {};
  var emailCount;
  const salt = 10
  var plainPassword;
   //get api user to check username and password
  var passwordCompareResult = ""
  var individualToken=""
  app.get('/signin', (req, res) => {
    const { name} = req.body;
    plainPassword = req.body.password;
    con.query('SELECT name,password  FROM user WHERE name=?', [name], (err, results) => {
      //console.log(results[0],"<<<->>>"+results[0].toString.length)
      if(results[0]==null)
      {
        res.status(200).json({ Message: 'Seems You Entered Wrong Credentials' });
        return;
      }
      else if(results[0].toString().length>1)
      {
      var hashedPassword = results[0].password
      //compare bycrpted password function
      bcrypt.compare(plainPassword, hashedPassword, function (err, result) {
        if (result) {
          passwordCompareResult = result
        }
        if (err) {
          res.status(400).json({ Message: 'User DoesNot Exists' })
        }
        //res.json(results);
        console.log(passwordCompareResult)
        if (passwordCompareResult == true) {
          //jwt token generation process code below
          let jwtSecretKey = process.env.JWT_SECRET_KEY;
          let data = {
            name: req.body.name,
            password: req.body.password,
          }
          //const username = req.body.name;
          var jwtTokens = jwt.sign(data, jwtSecretKey);
          var activity = "Active"
          var date = Date()
          //res.send();
          //res.status(200).send(username,token);
          individualToken=jwtTokens
          con.query('INSERT INTO login (name,jwttoken,activity,date) VALUES (?,?,?,?)', [name, jwtTokens, activity, date], (err, results) => {
            if (err) throw err;
            //res.json(name,jwtTokens);
            res.status(200).json({ name, jwtTokens })
          });
        }
        else {
          res.status(200).json({ Message: 'Seems You Entered Wrong Credentials' })
        }
      });

    }
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
    //console.log("IndividualToken===>>>>"+individualToken+">>>>->>>>>"+req.body.token);
    if(req.body.token==individualToken)
    {
      console.log("Token Checking Done SuccessFully");
      con.query('SELECT * FROM orders', (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  }
  });
//post order api for order placing
app.post('/orders', (req, res) => {
  //console.log("IndividualToken===>>>>"+individualToken+">>>>->>>>>"+req.body.token);
  var orderUserName=req.body.name;
  if(req.body.token==individualToken)
  {
    console.log("Token Checking Done SuccessFully");
    con.query('INSERT INTO order(user_id,email,name,dob,address,password) VALUES (?, ?,?,?,?,?)', [user_id, email, orderUserName, dob, address, bycrypted], (err, result) => {
      if (err) throw err;
      res.json({ message: 'User added successfully' });
    });
    
}
});
  //get api for all product list
  app.get('/product', (req, res) => {
    console.log("IndividualToken===>>>>"+individualToken+">>>>->>>>>"+req.body.token);
    if(req.body.token==individualToken)
    {
      console.log("Token Checking Done SuccessFully");
    con.query('SELECT * FROM product', (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  }
  });
  //User SingUp
  app.post('/signup', (req, res, next) => {
    const { user_id, email, name, dob, address, password } = req.body;
    console.log(req.body)
    const emailid = req.body.email;

    if (!emailid) {
      return res.status(400).send({
        message: "Email  Missing."
      })
    }
    if (!name) {
      return res.status(400).send({
        message: "Name Missing"
      })
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
    //Email validation inbuilt Function validator
    isvalid = validator.validate(emailid);
    //Code Below to check Email Already Exits or Not
    con.query('SELECT COUNT(*) AS count FROM user WHERE email=?', [emailid], (err, results) => {
      if (err) throw err;
      emailCount = results[0].count;
      console.log("Count=>" + emailCount)
      //Code Below to insert New Emailid based User
      if (isvalid && emailCount == 0) {
        var bycryptPassword = req.body.password
        bcrypt.hash(bycryptPassword.toString(), salt, (err, hash) => {
          if (err) {
            console.log(err);
          }
          var bycrypted = hash;
          con.query('INSERT INTO user (user_id,email,name,dob,address,password) VALUES (?, ?,?,?,?,?)', [user_id, email, name, dob, address, bycrypted], (err, result) => {
            if (err) throw err;
            res.json({ message: 'User added successfully' });
          });

        })
        
      }
      if (emailCount > 0) {
        res.send({ message: "Email Already Exits With Us" })
      }
      if (isvalid == false) {
        return res.status(400).send({
          message: "Please provide a valid email Address"

        })
      }
    });
  });
  });
//Local Server Start Code Below
app.listen(port);

