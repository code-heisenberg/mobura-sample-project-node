const bcrypt = require('bcrypt');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));

const saltRounds = 10; // This should be defined somewhere appropriate

function hashPassword(plainPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(plainPassword.toString(), saltRounds, (err, hash) => {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
}

module.exports = hashPassword;