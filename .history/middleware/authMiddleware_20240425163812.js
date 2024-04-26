const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, 'SECRET_KEY', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    if(!err)
    {
      return responseUtils.returnStatusCodeWithMessage(res, 200, "Token Authenticated");
    }
    req.user = decoded;
    apiaccesrights(req.user);
    next();
  });
};
function apiaccesrights(user)
{

}

module.exports = verifyToken;

