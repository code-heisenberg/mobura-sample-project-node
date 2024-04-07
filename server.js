const http = require('http');
const router = require('./router/routes')
const port = process.env.port || 3000;
const server = http.createServer(router);
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
//const app = express();

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
  
  //con.query('select * from product', function (err, result) {
  //  if (err) throw err;
 //   console.log("Result: " + result);
  //});
});



///Local Server Start Code
server.listen(port);

