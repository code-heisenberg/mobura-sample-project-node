const nodemailer = require('nodemailer'); 
const jwt = require('jsonwebtoken'); 
function sendEmail(userEmail,userPassword,token4Email)
{
const transporter = nodemailer.createTransport({ 
	host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service : 'Gmail',
    
    auth: {
      user: userEmail,
      pass: userPassword
	} 
}); 

// const token = jwt.sign({ 
// 		data: 'Token Data'  
// 	}, 'env.JWT_SECRET_KEY', { expiresIn: '10m' } 
// );	 

const mailConfigurations = { 

	// It should be a string of sender/server email 
	from: 'mrtwinklesharma@gmail.com', 

	to: userEmail, 

	// Subject of Email 
	subject: 'Email Verification', 
	
	// This would be the text of email body 
	text: `Hi! There, You have recently visited 
		our website and entered your email. 
		Please follow the given link to verify your email 
		http://localhost:3000/verify/${token4Email} 
		Thanks` 
	
}; 

transporter.sendMail(mailConfigurations, function(error, info){ 
	if (error) throw Error(error); 
	console.log('Email Sent Successfully'); 
	console.log(info); 
}); 
}
module.exports={
    sendEmail
} 