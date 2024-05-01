const express = require('express');
const app = express();
const bodyParser = require('body-parser');

editValidations = async (bodyKey, permittedFields) => {
    
    // Middleware to check if all fields in req.body are in allowedFields
        const bodyKeys = Object.keys(bodyKey);
        const extraFields = bodyKeys.filter(key => !permittedFields.includes(key));

        if (extraFields.length > 0) {
            return res.status(400).json({ error: `Extra fields found: ${extraFields.join(', ')}` });
        }

    return "Success"
    

}