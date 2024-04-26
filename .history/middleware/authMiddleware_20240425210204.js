const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const verifyToken = (token) => {

  if (!token) {
    return json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, 'SECRET_KEY', (err, decoded) => {
    if (err) {
      return json({ error: 'Unauthorized: Invalid token' });
    }
    if(!err)
    {
      return json({ error: 'Unauthorized: No token provided' });
    }
    req.user = decoded;
    apiaccesrights(req.user);
    next();
  });
};
function apiaccesrights(user)
{
   return {message:ApiRightsSectionIsNotCompleted}
}

module.exports = verifyToken;

