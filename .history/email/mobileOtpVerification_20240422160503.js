// middleware/otp.js
const jwt = require('jsonwebtoken');
//const twilio = require('twilio');

const TWILIO_ACCOUNT_SID = 'ACbd32e4f96cdc170dba03077e5bcdc2e3';
const TWILIO_AUTH_TOKEN = '980908cbb1a5108d7a81ac82464f22c0';
const TWILIO_PHONE_NUMBER = '+12513158466';

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

function generateOTP(phoneNumber) {
  let otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
  const token = jwt.sign({ otp }, 'SECRET_KEY', { expiresIn: '5m' }); // Expires in 5 minutes
  //return { otp, token };
  async function sendOTP(phoneNumber, otp) {
    try {
      await client.messages.create({
        body: `Your OTP is: ${otp}`,
        from: +12513158466,
        to: phoneNumber
      });
      console.log('OTP sent successfully');
      return otp,token
 
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  }
  return token
}



function verifyOTP(token, otp) {
  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    return decoded.otp === otp;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return false;
  }
}

module.exports = { generateOTP, sendOTP, verifyOTP };
