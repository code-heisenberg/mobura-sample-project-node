// app.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const candiRoutes = require('./routes/candidatesRoutes');
const visaRoutes = require('./routes/visaRoutes');
//const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
//app.use('/users', userRoutes);
app.use('/candi', candiRoutes);
app.use('/visa', visaRoutes);


// Error handling middleware
app.use(errorHandler);
//Verify Email Api


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
