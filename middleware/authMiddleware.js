const jwt = require('jsonwebtoken');
const { Module } = require('module');
const { decode } = require('punycode');
const util = require('util');
const userModel = require('../models/postgressql.userModel');
const verifyAsync = util.promisify(jwt.verify);
const apiAccessRights = async (code, apiname) => {
  try {
    const decoded = await verifyAsync(code, 'SECRET_KEY');
    const user = decoded.username;
    console.log("Token Authorized");
    const userRights = await userModel.usersRights(user,apiname);
    return userRights;
  } catch (error) {
    console.error('Error fetching user names:', error);
    throw error;
  }
};
module.exports = { apiAccessRights };


