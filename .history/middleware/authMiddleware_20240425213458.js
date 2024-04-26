const jwt = require('jsonwebtoken');
const { decode } = require('punycode');

const verifyToken = (req, res, next) => {
  //const token = req.headers['authorization'];
  let code= req.params.code;
//console.log("Token=>from code"+code);
  if (!code) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  jwt.verify(code, 'SECRET_KEY', (err, decoded) => {
    console.log("Username From Jwt APi-->"+decoded.user_name);
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    if(!err)
    {
      return res.status(200).json({ Success: 'Authorized: Token--> Hurrey' });
    }
    
    apiAccesRights(decoded);
    next();
  });
};
function apiAccessRights(user)
{
   return {message:"ApiRightsSectionIsNotCompleted"}
}

module.exports = verifyToken;

