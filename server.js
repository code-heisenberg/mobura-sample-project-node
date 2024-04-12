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
const uuid = require('uuid');
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
  var plainPassword="";
  var userId=""
  var date=""
   //get api user to check username and password
  var passwordCompareResult = ""
  var individualToken=""
  app.get('/signin', (req, res) => {
    const { name} = req.body;
    plainPassword = req.body.password;

    con.query('SELECT user_id,name,password  FROM user WHERE name=?', [name], (err, results) => {
      //console.log(results[0],"<<<->>>"+results[0].toString.length)
      if(results[0]==null)
      {
        res.status(200).json({ Message: 'Seems You Entered Wrong Credentials' });
        return;
      }
      else if(results[0].toString().length>1)
      {
      var hashedPassword = results[0].password
      userId = results[0].user_id;
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
          var token = jwt.sign(data, jwtSecretKey);
          var activity = "Active"
          date = Date()
          //res.send();
          //res.status(200).send(username,token);
          individualToken=token

          con.query('INSERT INTO login (user_id,name,token,activity,date) VALUES (?,?,?,?,?)', [userId,name, token, activity, date], (err, results) => {
            if (err) throw err;
            //res.json(name,jwtTokens);
            res.status(200).json({userId,name, token })
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
   const { order_id,user_id,product_id,payment_option,billing_address,email,mobile,date,shipping_address } = req.body;
   const uniqueId = uuid.v4();
  console.log("UniqueId->"+uniqueId);
  if(!user_id==false && !product_id==false && !payment_option==false && !billing_address==false && !email==false && !mobile==false && !date==false && !shipping_address==false)
  {
  if(req.body.token==individualToken)
  {
    console.log("Token Checking Done SuccessFully");
    con.query('INSERT INTO orders(order_id,user_id,product_id,payment_option,billing_address,email,mobile,date,shipping_address) VALUES (?,?,?,?,?,?,?,?,?)', [uniqueId,user_id,product_id,payment_option,billing_address,email,mobile,date,shipping_address], (err, result) => {
      if (err) throw err;
      res.json({ message: 'Order Submitted Successfully' });
    });
    
   }
  }
  else if(!user_id==true && !product_id==true && !payment_option==true && !billing_address==true && !email==true && !mobile==true && !date==true && !shipping_address==true)
  {
  res.status(400).send({Message:'Please Fill ALl Fields For Order Submission'})
  }
});
//API FOR ORDER-ID BASED SEARCH
app.get('/orderId', (req, res) => {
  //console.log("IndividualToken===>>>>"+individualToken+">>>>->>>>>"+req.body.token);
  var orderId=req.body.order_id
  if(req.body.token==individualToken)
  {
      console.log("Token Checking Done SuccessFully");
      con.query('SELECT order_id,user_id,product_id,payment_option,billing_address,email,mobile,date,shipping_address  FROM orders WHERE order_id=?', [orderId], (err, results) => {
      if (err) throw err;
      res.json(results);
    });
    
    
}
});
//post product api for order placing
app.post('/product', (req, res) => {
  var { product_id,product_name,image,product_price,product_quantity,category_id,date } = req.body;
  var category_ids = uuid.v4();
 console.log("UniqueId->"+category_ids);
 
if(!product_id==false && !product_name==false && !product_price==false && !product_quantity==false && !category_id==false && !date==false)
{
 if(req.body.token==individualToken)
 {
   console.log("Token Checking Done SuccessFully");
   con.query('INSERT INTO product(product_id,product_name,image,product_price,product_quantity,category_id,date) VALUES (?,?,?,?,?,?,?)', [product_id,product_name,image,product_price,product_quantity,category_id,date], (err, result) => {
     if (err) throw err;
     res.json({ message: 'Product Submitted Successfully' });
  
   })

    }
 
 }
else if(!product_id==true || !product_name==true || !product_price==true || !product_quantity==true || !category_id==true || !date==true)
  res.status(400).send({Message:'Please Fill ALl Fields For Order Submission'})
})
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
  //API FOR product-ID BASED SEARCH
app.get('/productId', (req, res) => {
  //console.log("IndividualToken===>>>>"+individualToken+">>>>->>>>>"+req.body.token);
  var productId=req.body.product_id
  if(req.body.token==individualToken)
  {
      console.log("Token Checking Done SuccessFully");
      con.query('SELECT product_id,product_name,image,product_price,product_quantity,category_id  FROM product WHERE product_id=?', [productId], (err, results) => {
      if (err) throw err;
      res.json(results);
    });
    
    
}
});
  //User SingUp
  app.post('/signup', (req, res, next) => {
    const { user_id, email, name, dob, address, password,mobile } = req.body;
    console.log(req.body)
    const emailId = req.body.email;

    if (!emailId) {
      return res.status(400).send({
        message: "Email  Missing"
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
    if (!password) {
      return res.status(400).send({
        message: "Please Enter Password of Your Choice"
      })
    }
    if (!mobile) {
      return res.status(400).send({
        message: "Please Enter [A] Valid Mobile->Number"
      })
    }
    //Email validation inbuilt Function validator
    isvalid = validator.validate(emailId);
    //Code Below to check Email Already Exits or Not
    con.query('SELECT COUNT(*) AS count FROM user WHERE email=?', [emailId], (err, results) => {
      if (err) throw err;

      emailCount = results[0].count;
      console.log("Count=>" + emailCount)
      //Code Below to insert New user based on emailId
      if (isvalid && emailCount == 0) {
        var bycryptPassword = req.body.password
        bcrypt.hash(bycryptPassword.toString(), salt, (err, hash) => {
          if (err) {
            console.log(err);
          }
          var bycrypted = hash;
          con.query('INSERT INTO user (user_id,email,name,dob,address,password,mobile) VALUES (?, ?,?,?,?,?)', [user_id, email, name, dob, address, bycrypted,mobile], (err, result) => {
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
          message: "Please Provide [A] Valid Email Address"
        })
      }
    });
  });
  });
//Local Server Start Code Below
app.listen(port);

