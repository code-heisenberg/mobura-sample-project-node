const nodemailer = require('nodemailer'); 
const jwt = require('jsonwebtoken'); 
//pass: 'rptt nohl mjmf byrt'    Gmail-App Password under 2-way Verification Section
function sendEmailOtp(userEmail)
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
let users = {};
// Store OTP and its expiry time (e.g., 5 minutes)
let otp = Math.floor(100000 + Math.random() * 900000).toString();
users[email] = {
        otp,
expiry: Date.now() + 5 * 60 * 1000 // 5 minutes
}

const mailConfigurations = { 

	// It should be a string of sender/server email 
	from: 'noreply@gmail.com', 

	to: 'prince.mobura@gmail.com', 

	// Subject of Email 
	subject: 'Email Verification', 
	
	// This would be the text of email body 
	text: `Hi! Copy OTP And Complete Verification
		http://localhost:3000/auth/verifyEmailOtp/${'-->'+otp} 
		Thanks` 
	
}; 

transporter.sendMail(mailConfigurations, function(error, info){ 
	if (error) throw Error(error); 
	
    //console.log(info); 
	
}); 
console.log('Email-Otp Sent Successfully'); 
console.log(Date.now());
return users
}
module.exports={
    sendEmailOtp
	
} 