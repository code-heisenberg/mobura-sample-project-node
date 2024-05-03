// middleware/otp.js
const jwt = require('jsonwebtoken');
const twilio = require('twilio');

async function generateOTP(mobile) {
  if (mobile) {
    let otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    // Expires in 5 minutes
    // Create an instance of the Twilio client
    const accountSid = 'ACbd32e4f96cdc170dba03077e5bcdc2e3';
    const authToken = 'fa52dd322457c95129c9c70b7d694828';
    const client = await require('twilio')(accountSid, authToken);
    client.messages
      .create({
        body: 'Hello Please Enter OTP In Website' + otp,
        from: '+12513158466',
        to: mobile
      })
      .then(message => console.log(message.sid));
      return {otp};
  }

}
async function verifyOTP(otp) {
  try {
    const decoded = jwt.verify(otp, 'SECRET_KEY');
    if (decoded.otp === otp) {
      console.log('MOBILE-OTP Got Verified Successfully');
      return decoded.otp;
    }

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return false;
  }

}
module.exports = { generateOTP, verifyOTP };
