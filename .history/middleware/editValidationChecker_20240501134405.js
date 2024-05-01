const express = require('express');
const app = express();
const bodyParser = require('body-parser');

editValidations = async (bodyKeys, permittedFields) => {
    const allowedFields = ['field1', 'field2', 'field3']; // Add your field names here
    // Middleware to check if all fields in req.body are in allowedFields
        const bodyKeys = Object.keys(req.body);
        const extraFields = bodyKeys.filter(key => !allowedFields.includes(key));

        if (extraFields.length > 0) {
            return res.status(400).json({ error: `Extra fields found: ${extraFields.join(', ')}` });
        }

    return "Success"
    

}