const express = require('express');
const app = express();
const bodyParser = require('body-parser');

async function editValidations (bodyKey, permittedFields){
        // Middleware to check if all fields in req.body are in allowedFields
        const bodyKeys = Object.keys(bodyKey);
        const extraFields = bodyKeys.filter(key => ! String(permittedFields).includes(key));

        if (extraFields.length > 0) {
            return ({ error: `Extra fields found: ${extraFields.join(', ')}` });
        }
    return "Success"

}
module.exports = {editValidations};