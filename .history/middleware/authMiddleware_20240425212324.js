const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  //const token = req.headers['authorization'];
  let code= req.params.code;
//console.log("Token=>from code"+code);
  if (!code) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  jwt.verify(code, 'SECRET_KEY', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    if(!err)
    {
      return res.status(200).json({ Success: 'Authorized: Token--> Hurrey' });
    }
    apiaccesrights(decoded);
    next();
  });
};
function apiaccesrights(user)
{
   return {message:ApiRightsSectionIsNotCompleted}
}

module.exports = verifyToken;

