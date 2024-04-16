// app.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Error handling middleware
app.use(errorHandler);
//Verify Email Api
app.get('/verifyEmail/:code', (req, res) => {
  var { email,code } = req.body;
const uniqueNumber=req.params.code;
//Code to Get emailVerificationCode From Db
con.query('SELECT emailVerificationCode FROM user WHERE emailVerificationCode=?', [uniqueNumber], (err, results) => {
  if (err) throw err;
  
  res.json('EMAiL-VERiFiCATiON DONE=>[SUCCESS-FULLY]');

 if (!results=="") {
    //res.render('set-newPassword');
  
  }
  else
  {
    res.json('WRONG EMAiL-VERiFiCATiON [LiNK]');
  }
});

})


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
