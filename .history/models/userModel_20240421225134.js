// models/userModel.js
const db = require('../configs/database');
const bcrypt = require('bcrypt');
const { tables } = require('../utils/tableNames.utils');

const UserModel = {
  createUser: async (user_id,email,userName,dob,address,password,mobile) => {
    
    //const hashedPassword = await bcrypt.hash(password, 10);
    //console.log(user_id,email,userName,dob,address,password,mobile);
    const sql = 'INSERT INTO user (user_id,email,userName,dob,address,password,mobile) VALUES (?,?,?,?,?,?,?)';
    const values = [user_id,email,userName,dob,address,password,mobile];
    
    try {
      await db.query(sql, values);
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  },
  tempCreateUser: async (user_id,email,userName,dob,address,password,mobile,emailVerificationCode,emailotp,otpvalidity) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO usertemp (user_id,email,userName,dob,address,password,mobile,emailverificationcode,emailotp,otpvalidity) VALUES (?,?,?,?,?,?,?,?,?,?)';
    const values = [user_id,email,userName,dob,address,hashedPassword,mobile,emailVerificationCode,emailotp,otpvalidity];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  },

  findById: async (email) => {
    const sql = 'SELECT * FROM user WHERE userName = ?';
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
    const sql = 'SELECT * FROM user WHERE userName = ?';
    const values = [userName];
    try {
      const [user] = await db.query(sql,values);
      return user;
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  },
  findByTempUserName: async (userName) => {
    const sql = 'SELECT user_id,email,userName,dob,address,password,mobile FROM usertemp WHERE userName = ?';
    const values = [userName];
    try {
      const [user] = await db.query(sql, values);
      return user;
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  },
  findByEmailVerificationCode: async (Code) => {
    const sql = 'SELECT user_id,email,userName,dob,address,password,mobile,emailverificationcode FROM usertemp WHERE emailverificationcode = ?';
    const values = [Code];
    try {
      const [user] = await db.query(sql, values);
      return user;
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  },
  findByEmailOtpCode: async (otp) => {
    const sql = 'SELECT emailotp FROM usertemp WHERE emailotp = ?';
    const values = [otp];
    try {
      const [user] = await db.query(sql, values);
      return user;
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  },
  findByMobileOtpCode: async (otp) => {
    const sql = 'SELECT emailotp FROM usertemp WHERE emailotp = ?';
    const values = [otp];
    try {
      const [user] = await db.query(sql, values);
      return user;
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  },
  findByEmailOtpCodeAllData: async (otp) => {
    const sql = 'SELECT user_id, email, userName, dob, address, password, mobile FROM usertemp WHERE emailotp = ?';
    const values = [otp];
    try {
      const [user] = await db.query(sql, values);
      return user;
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }
  ,
  withOutEmailVerificationCode: async (useruserName) => {
    const sql = 'SELECT user_id,email,userName,dob,address,password,mobile FROM usertemp WHERE userName = ?';
    const values = [useruserName];
    try {
      const [user] = await db.query(sql, values);
      return user;
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  },
  updatePassword: async (userName, newPassword) => {
    const sql = 'UPDATE user SET password = ? WHERE userName = ?';
    const values = [newPassword, userName];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  },

  deleteUser: async (userName) => {
    const sql = 'DELETE FROM usertemp WHERE userName = ?';
    const values = [userName];
    try {
      await db.query(sql, values);
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  },
  userLogin: async (userName,password) => {
    let activity="active";
    let date = Date();
    const sql = 'INSERT INTO login (userName,token,activity,date) VALUES (?,?,?,?)';
    const values = [userName,token,activity,date];
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
