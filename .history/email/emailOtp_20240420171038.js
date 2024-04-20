const nodemailer = require('nodemailer'); 
const jwt = require('jsonwebtoken'); 
//pass: 'rptt nohl mjmf byrt'    Gmail-App Password under 2-way Verification Section
function sendEmail(userEmail,token4Email)
{
const transporter = nodemailer.createTransport({ 
	host: 'smtp.gmail.com',
    port: 465,
    secure: false,
    service : 'gmail',
    
    auth: {
      user: 'johnadam7x@gmail.com',
      pass: 'rptt nohl mjmf byrt'
	} ,
	tls:
	{
		rejectUnauthorized:false
	}
}); 

// const token = jwt.sign({ 
// 		data: 'Token Data'  
// 	}, 'env.JWT_SECRET_KEY', { expiresIn: '10m' } 
// );	 
const users = {};
// Endpoint to request OTP
// Generate OTP
const otp = Math.floor(100000 + Math.random() * 900000).toString();
// Store OTP and its expiry time (e.g., 5 minutes)
users[email] = {
otp,
expiry: Date.now() + 5 * 60 * 1000 // 5 minutes
}
const mailConfigurations = { 

	// It should be a string of sender/server email 
	from: 'noreply@gmail.com', 

	to: 'johnadam7x@gmail.com', 

	// Subject of Email 
	subject: 'Email Verification', 
	
	// This would be the text of email body 
	Otp: `Hi! Copy OTP And Complete Verification
		http://localhost:3000/auth/verifyEmailOtp/${otp} 
		Thanks` 
	
}; 

transporter.sendMail(mailConfigurations, function(error, info){ 
	if (error) throw Error(error); 
	console.log('Email-Otp Sent Successfully'); 
    //console.log(info); 
	
}); 
}
module.exports={
    sendEmailOtp
	
} 