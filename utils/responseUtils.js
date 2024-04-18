// utils/responseUtils.js
const dotenv = require('dotenv');
 function returnStatusCodeWithMessage(res,code,message)
    {
      return  res.status(code).send({
        message: message
    });
  }
  module.exports = {returnStatusCodeWithMessage};



