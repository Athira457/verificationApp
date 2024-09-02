const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const axios = require("axios");
const bodyParser = require('body-parser')
const router = express.Router();

// User registration
router.post('/signup', async (req, res) => {
    const { name, email, phoneNum, aadharNum, DOB, password } = req.body;
    console.log(req.body)
  
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      user = new User({
        name,
        email,
        phoneNum,
        aadharNum,
        DOB,
        password: await bcrypt.hash(password, 10)
      });

      await user.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error found' });
    }
  });
// ----------------------------------------------------------------------------


//------------------Generate OTP in email--------------
  router.post('/generate-otp', async (req, res) => {
    const { email } = req.body;

    const otp = otpGenerator.generate(6, { 
      digits: true,  
      upperCaseAlphabets: false,
      lowerCaseAlphabets:false, 
      specialChars: false 
    });
    console.log(otp);
    
    try {
        await User.findOneAndUpdate({ email, otp });

        // Send OTP via email 
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'athiraajaykumar2001@gmail.com',
                pass: 'tcxdqnjrqjkchesn'
            }
        });

        await transporter.sendMail({
            from: 'athiraajaykumar2001@gmail.com',
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP for verification is: ${otp}`
        });

        res.status(200).send('OTP sent successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending OTP');
    }
});

//------------------Email otp verification------------------
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  console.log(email,otp);
  
  try {
      const otpRecord = await User.findOne({ otp});
      if (otpRecord) {
          await User.updateOne({ email }, { $set: { isEmailVerified: true } });
          res.status(200).send('OTP verified');
      } else {
          res.status(400).send('Invalid OTP');
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Error verifying OTP');
  }
});
// ----------------------------------------------------------------------------


//------------------Mobile OTP generate-----------------
// Twilio credentials
const accountSid = process.env.account_sid;
const authToken = process.env.auth_token;
const twilioPhoneNumber = process.env.phone;
const client = twilio(accountSid, authToken);

router.post('/generate-otp-sms', async (req, res) => {
  const { email, phoneNum } = req.body;
  const otpPhn = otpGenerator.generate(6, { 
              digits: true,  
              upperCaseAlphabets: false,
              lowerCaseAlphabets:false, 
              specialChars: false 
              });
  console.log("generated",otpPhn);
  try {
    await User.findOneAndUpdate(
      { phoneNum },
      { otpPhn },
      { new: true, upsert: true } 
  );
    // Send OTP via SMS
    client.messages.create({
        body: `Your OTP for verification is: ${otpPhn}`,
        from: twilioPhoneNumber,
        to: `+91${phoneNum}`,
    });

    res.status(200).send('OTP sent successfully');
} catch (error) {
    console.error(error);
    res.status(500).send('Error sending OTP');
}
});

//------------------Mobile otp verification-------------------
router.post('/verify-otp-sms', async (req, res) => {
  const { otpPhn, phoneNum } = req.body;
  console.log("entered", otpPhn, phoneNum);
  
  try {
      // Retrieve OTP from session
      const stored = await User.findOne({ phoneNum, otpPhn });   
        if (stored) {
            await User.updateOne({ phoneNum }, { $set: { isPhoneVerified: true } });
            res.status(200).send('OTP verified');
      } else {
          res.status(400).send('Invalid OTP');
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Error verifying OTP');
  }
});
// ----------------------------------------------------------------------------


//------------------Aadhar verification-----------------

router.post('/verify-aadhar', async (req, res) => {
  const { aadharNum } = req.body;

  // const options = {
  //   method: 'POST',
  //   url: 'https://api.apyhub.com/validate/aadhaar',
  //   headers: {
  //     'apy-token': 'APY0nUS7Mkat55vzKlzwoTsvxV8N3TskfZKpACajcJFfI6zrGFVg5VEFIyy0Pbgd2qNWPoDMge',
  //     'Content-Type': 'application/json'
  //   },
  //   data: { aadhaarNum:aadharNum }
  // };

  const options = {
    method: 'POST',
    url: 'https://api.apyhub.com//validate/aadhaar',
    headers: {
      'Content-Type': 'application/json',
      'apy-token': 'APY0nUS7Mkat55vzKlzwoTsvxV8N3TskfZKpACajcJFfI6zrGFVg5VEFIyy0Pbgd2qNWPoDMge'
    },
    data: {aadhaar: aadharNum}
  };

  try {
    
    
    const response = await axios.request(options);
    console.log(response);
    
    if (response.data.data) {
      const user = await User.findOneAndUpdate(
        { aadharNum : aadharNum },
        { $set: {  isAadharVerified: true } },
        { new: true }
    );
      // if (!user) {
      //   return res.status(404).json({ message: 'User Not Found' });
      // }
      return res.status(200).json({ message: 'Aadhar Verified' });
    } else {
      return res.status(400).json({ message: 'Invalid Aadhar ID' });
    }
  } catch (error) 
  {
    console.log(error)
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
  
});

// ----------------------------------------------------------------------------
module.exports = router;