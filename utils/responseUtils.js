// utils/responseUtils.js
const dotenv = require('dotenv');
 async function returnStatusCodeWithMessage(res,code,message)
    {
      return  await res.status(code).send({
        message: message
    });
  }
  module.exports = {returnStatusCodeWithMessage};



