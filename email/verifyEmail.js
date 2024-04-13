const express = require('express'); 
const jwt = require('jsonwebtoken'); 

const app = express(); 
const PORT = 3000; 

app.get('/verify/:token', (req, res)=>{ 
	const {token} = req.params; 

	// Verifying the JWT token 
	jwt.verify(token, 'ourSecretKey', function(err, decoded) { 
		if (err) { 
			console.log(err); 
			res.send("Email verification failed,possibly the link is invalid or expired"); 
		} 
		else { 
			res.send("Email verifified successfully"); 
		} 
	}); 
}); 

app.listen(PORT, (error) =>{ 
	if(!error) 
		console.log("Server is Successfully Running,and App is listening on port "+ PORT) 
	else
		console.log("Error occurred, server can't start", error); 
	} 
); 
