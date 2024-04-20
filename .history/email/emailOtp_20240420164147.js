const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const app = express();
const port = 3000;
// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'your_email@gmail.com',
        pass: 'your_password'
    }
});
// Database (temporary, just for demonstration)
const users = {};
// Endpoint to request OTP
app.post('/request-otp', (req, res) => {
    const { email } = req.body;

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP and its expiry time (e.g., 5 minutes)
    users[email] = {
        otp,
        expiry: Date.now() + 5 * 60 * 1000 // 5 minutes
    };

    // Send email
    transporter.sendMail({
        from: 'noreply@gmail.com',
        to: 'johnadam7x@gmail.com',
        subject: 'Email Verification OTP',
        text: `Your OTP is ${otp}`
    }, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Failed to send OTP');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('OTP sent to your email');
        }
    });
});

// // Endpoint to verify OTP
// app.post('/verify-otp', (req, res) => {
//     const { email, otp } = req.body;

//     // Check if OTP exists and not expired
//     if (!users[email] || Date.now() > users[email].expiry) {
//         return res.status(400).send('OTP expired or invalid');
//     }

//     // Verify OTP
//     if (users[email].otp === otp) {
//         // Success: OTP matched
//         delete users[email]; // Remove user data after successful verification
//         res.send('Email verified successfully');
//     } else {
//         // Failure: OTP doesn't match
//         res.status(400).send('Invalid OTP');
//     }
// });


