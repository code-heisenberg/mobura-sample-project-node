const jwt = require('jsonwebtoken');
const { decode } = require('punycode');

const verifyToken = (req, res, next) => {
  //const token = req.headers['authorization'];
  let code= req.params.code;
//console.log("Token=>from code"+code);
  if (!code) {
    return res.status(401).json({ error: 'Un-Authorized: No Token Provided' });
  }
  jwt.verify(code, 'SECRET_KEY', (err, decoded) => {
    console.log("Username From Jwt APi-->"+decoded.userr);
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Token' });
    }
    if(!err)
    {
      return res.status(200).json({ Success: 'Authorized: Token--> Hurrey' });
    }
    
    console.log(apiAccesRights(decoded));
    next();
  });

};


module.exports = verifyToken;

