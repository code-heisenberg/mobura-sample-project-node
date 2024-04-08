const http = require('http');
//const router = require('./router/routes')
const port = process.env.port || 3000;
//const server = http.createServer(router);
////
const express = require('express');
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
  //})
})
con.connect(function(err) {
  if (err)
  {
   console.log("Error While Connection")
   return 
  }
  
  console.log("Connected!");
  //EmailValidation Async Function
  
  
  //get api for all product list
  app.get('/product', (req, res) => {
    con.query('SELECT * FROM product', (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
  //get api for all user list
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
  app.post('/signin',  (req, res, next)=>  {
    const { user_id,email,name,dob,address,token } = req.body;
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

     isvalid = validator.validate(emailid);

    if (isvalid)
    {
      con.query('INSERT INTO user (user_id,email,name,dob,address,token) VALUES (?, ?,?,?,?,?)', [user_id,email,name,dob,address,token], (err, result) => {
        if (err) throw err;
        res.json({ message: 'User added successfully', id: result.insertId });
      });
      return res.send({message: "User Details Updated"}
    );
    }
  
    return res.status(400).send({
      message: "Please provide a valid email address.",
      reason: validators[reason].reason
    })
    

    
  });
  
/////////
});







///Local Server Start Code
app.listen(port);

