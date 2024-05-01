const express = require('express');
const app = express();
const bodyParser = require('body-parser');

async function editValidations (bodyKey, permittedFields){
        // Middleware to check if all fields in req.body are in allowedFields
        console.log("permittedFields===>"+permittedFields);
        const bodyKeys = bodyKey;
        const extraFields = bodyKeys.filter(key => ! String(permittedFields).includes(key));

        if (extraFields.length > 0) {
            console.log("extraFields------>"+extraFields);
            return { error: `Extra fields found: ${extraFields.join(', ')}` };
        }
    return "Success"

}
module.exports = {editValidations};