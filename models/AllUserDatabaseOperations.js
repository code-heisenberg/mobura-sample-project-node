// models/userModel.js
const db = require('../config/database');
const bcrypt = require('bcrypt');

const UserModel = {
  createUser: async (user_id,email,name,dob,address,password,mobile) => {
    
    //const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO user (user_id,email,name,dob,address,password,mobile) VALUES (?,?,?,?,?,?,?)';
    const values = [user_id,email,name,dob,address,password,mobile];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  },
  tempCreateUser: async (user_id,email,userName,dob,address,password,mobile,emailVerificationCode) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO usertemp (user_id,email,name,dob,address,password,mobile,emailverificationcode) VALUES (?,?,?,?,?,?,?,?)';
    const values = [user_id,email,userName,dob,address,hashedPassword,mobile,emailVerificationCode];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  },

  findById: async (email) => {
    const sql = 'SELECT * FROM user WHERE email = ?';
    const values = [email];
    try {
      const [user] = await db.query(sql, values);
      return user;
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  },

  findByEmail: async (email) => {
    const sql = 'SELECT * FROM user WHERE email = ?';
    const values = [email];
    try {
      const [user] = await db.query(sql, values);
      return user;
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  },
  findByUserName: async (userName) => {
    const sql = 'SELECT * FROM user WHERE name = ?';
    const values = [userName];
    try {
      const [user] = await db.query(sql, values);
      return user;
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  },
  findByEmailVerificationCode: async (Code) => {
    const sql = 'SELECT user_id,email,name,dob,address,password,mobile,emailverificationcode FROM usertemp WHERE emailverificationcode = ?';
    const values = [Code];
    try {
      const [user] = await db.query(sql, values);
      
      return user;
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  },
  updatePassword: async (userName, newPassword) => {
    const sql = 'UPDATE user SET password = ? WHERE name = ?';
    const values = [newPassword, userName];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  },

  deleteUser: async (userName) => {
    const sql = 'DELETE FROM usertemp WHERE name = ?';
    const values = [userName];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  },
  userLogin: async (name,token) => {
    let activity="active";
    let date = Date();
    const sql = 'INSERT INTO login (name,token,activity,date) VALUES (?,?,?,?)';
    const values = [name,token,activity,date];

    try {
      await db.query(sql, values);
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }    
  },
  insertemailVerificationCode: async (code) => {
    const sql = 'INSERT INTO usertemp (emailverificationcode) VALUES (?)';
    const values = [code];
    
    try {
      await db.query(sql, values);
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  },
  getemailVerificationCode: async (code) => {
    const sql = 'SELECT emailverificationcode FROM usertemp WHERE emailverificationcode = ?';
    const values = [code];
    
    try {
      await db.query(sql, values);
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  },
  
};

module.exports = UserModel;
