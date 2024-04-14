const nodemailer = require('nodemailer'); 
const jwt = require('jsonwebtoken'); 
var emailVerificationResponse="";
var emailVerificationNumber="";
function sendEmail(userEmail,token4Email)
{
const transporter = nodemailer.createTransport({ 
	host: 'smtp.gmail.com',
    port: 465,
    secure: false,
    service : 'gmail',
    
    auth: {
      user: userEmail,
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

const mailConfigurations = { 

	// It should be a string of sender/server email 
	from: ' johnadam7x@gmail.com', 

	to: userEmail, 

	// Subject of Email 
	subject: 'Email Verification', 
	
	// This would be the text of email body 
	text: `Hi! There, You have recently visited 
		our website and entered your email. 
		Please follow the given link to verify your email 
		http://localhost:3000/forgotpassword/${token4Email} 
		Thanks` 
	
}; 

transporter.sendMail(mailConfigurations, function(error, info){ 
	if (error) throw Error(error); 
	console.log('Email Sent Successfully'); 
    emailVerificationNumber=10;
    //console.log(info); 
	
}); 
if(emailVerificationNumber==10)
{
	emailVerificationResponse="Verified";

}
return emailVerificationResponse;
}
module.exports={
    sendEmail
	
} 