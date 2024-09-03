const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const axios = require("axios");
const bodyParser = require('body-parser')
const http = require('https');
const https = require('https');
const router = express.Router();

// User registration
router.post('/signup', async (req, res) => {
    const { name, email, phoneNum, aadharNum, DOB, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const newUser = new User({
        name,
        email,
        phoneNum,
        aadharNum,
        DOB,
        password: await bcrypt.hash(password, 10)
      });

      console.log(newUser)

      const response = await newUser.save();
      console.log(
        "respnnse", response 
      );
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
  const options = {
    method: 'POST',
    url: 'https://api.apyhub.com//validate/aadhaar',
    headers: {
      'Content-Type': 'application/json',
      'apy-token': 'APY07clu95EsYCcdCaN5zOtpkuXe5BRs76Uqs5QBtRV6frLX4m9QQxTRsAtNHzBSzXPAu'
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


//-------------------------GST number verification-----------------

router.post('/verify-gst', async (req, res) => {
  const { gstin } = req.body;
  const options = {
    method: 'POST',
    url: 'https://gst-verification.p.rapidapi.com/v3/tasks/sync/verify_with_source/ind_gst_certificate',
    headers: {
      'x-rapidapi-key': 'ddfa20bd14msh6a3d0cbf789b646p130d83jsn7f6f4cb26f7a',
      'x-rapidapi-host': 'gst-verification.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: {
      task_id: '74f4c926-250c-43ca-9c53-453e87ceacd1',
      group_id: '8e16424a-58fc-4ba4-ab20-5bc8e7c3c41e',
      data: { gstin: gstin }
    }
  };

  try {
    const response = await axios.request(options);
    console.log(response);

    if (response) {
      const user = await User.findOneAndUpdate(
        { gstin: gstin },
        { $set: { isGstVerified: true } },
        { new: true, upsert: true } 
      );

      // if (!user) {
      //   return res.status(404).json({ message: 'User Not Found' });
      // }
      return res.status(200).json({ message: 'GST Verified' });
    } else {
      return res.status(400).json({ message: 'Invalid GSTIN' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
});

// ----------------------------------------------------------------------------


//-------------------Address lookup -----------------------------

router.get('/verify-pincode/:pincode', async (req, res) => {
  const { pincode } = req.params;
  console.log(pincode);

  // Define options for the HTTPS request
  const options = {
    method: 'GET',
    hostname: 'india-pincode-with-latitude-and-longitude.p.rapidapi.com',
    port: null,
    path: `/api/v1/pincode/${pincode}`,  // Use the pincode from params
    headers: {
      'x-rapidapi-key': 'ddfa20bd14msh6a3d0cbf789b646p130d83jsn7f6f4cb26f7a',
      'x-rapidapi-host': 'india-pincode-with-latitude-and-longitude.p.rapidapi.com'
    }
  };

  try {
    // Make the HTTPS request
    const response = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        const chunks = [];

        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          const body = Buffer.concat(chunks).toString();
          resolve(body);
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });

    // Handle the response
    if (response) {
      // Verify the pincode details
      console.log(response);
      return res.status(200).json({ message: 'Pincode Verified', data: response });
    } else {
      return res.status(400).json({ message: 'Invalid Pincode' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something Went Wrong' });
  }
});

// ----------------------------------------------------------------------------


//-------------------------PAN number verification---------------------------

router.post('/verify-pan', (req, res) => {
  const { panNum } = req.body;

  const options = {
    method: 'POST',
    hostname: 'aadhaar-number-verification-api-using-pan-number.p.rapidapi.com',
    port: null,
    path: '/api/validation/pan_to_aadhaar',
    headers: {
      'x-rapidapi-key': 'ddfa20bd14msh6a3d0cbf789b646p130d83jsn7f6f4cb26f7a',
      'x-rapidapi-host': 'aadhaar-number-verification-api-using-pan-number.p.rapidapi.com',
      'Content-Type': 'application/json'
    }
  };

  const reqApi = https.request(options, function (resApi) {
    const chunks = [];

    resApi.on('data', function (chunk) {
      chunks.push(chunk);
    });

    resApi.on('end', async function () {
      const body = Buffer.concat(chunks).toString();
      try {
        const response = JSON.parse(body);
        
        if (response) { 
          // Update the user record with PAN verification status
          const user = await User.findOneAndUpdate(
            { pan: panNum },
            { $set: { isPanVerified: true } },
            { new: true, upsert: true } 
          );
          return res.status(200).json({ message: 'PAN Verified', user });
        } else {
          return res.status(400).json({ message: 'Invalid PAN' });
        }
      } catch (error) {
        console.error('Error parsing or processing response:', error);
        return res.status(500).json({ message: 'Something Went Wrong' });
      }
    });
  });

  reqApi.write(JSON.stringify({
    pan: panNum,
    consent: 'y',
    consent_text: 'I hereby declare my consent agreement for fetching my information via AITAN Labs API'
  }));

  reqApi.end();
});

// ----------------------------------------------------------------------------


//-------------------------Account Number verification------------------------------

router.post('/verify-bank-account', (req, res) => {
  const { bank_account_no, bank_ifsc_code } = req.body;

  const options = {
    method: 'POST',
    hostname: 'indian-bank-account-verification.p.rapidapi.com',
    port: null,
    path: '/v3/tasks/async/verify_with_source/validate_bank_account',
    headers: {
      'x-rapidapi-key': 'ddfa20bd14msh6a3d0cbf789b646p130d83jsn7f6f4cb26f7a',
      'x-rapidapi-host': 'indian-bank-account-verification.p.rapidapi.com',
      'Content-Type': 'application/json'
    }
  };

  const reqApi = https.request(options, function (resApi) {
    const chunks = [];

    resApi.on('data', function (chunk) {
      chunks.push(chunk);
    });

    resApi.on('end', function () {
      const body = Buffer.concat(chunks).toString();

      try {
        const response = JSON.parse(body);
        console.log(response);

        if (response) { // Assuming there's a 'status' field in the response
          return res.status(200).json({ message: 'Bank Account Verification Initiated', data: response });
        } else {
          return res.status(400).json({ message: 'Bank Account Verification Failed', data: response });
        }
      } catch (error) {
        console.error('Error processing response:', error);
        return res.status(500).json({ message: 'Something Went Wrong' });
      }
    });
  });

  reqApi.write(JSON.stringify({
    task_id:"123",
    group_id:'123',
    data: {
      bank_account_no,
      bank_ifsc_code
    }
  }));

  reqApi.end();
});
//--------------------------------------
router.get('/verify-bank-account/:requestId', (req, res) => {
  const { requestId } = req.params;

  const options = {
    method: 'GET',
    hostname: 'indian-bank-account-verification.p.rapidapi.com',
    port: null,
    path: `/v3/tasks?request_id=${requestId}`,
    headers: {
      'x-rapidapi-key': 'ddfa20bd14msh6a3d0cbf789b646p130d83jsn7f6f4cb26f7a',
      'x-rapidapi-host': 'indian-bank-account-verification.p.rapidapi.com'
    }
  };

  const reqApi = https.request(options, function (resApi) {
    const chunks = [];

    resApi.on('data', function (chunk) {
      chunks.push(chunk);
    });

    resApi.on('end', function () {
      const body = Buffer.concat(chunks).toString();

      try {
        const response = JSON.parse(body);
        console.log(response);

        if (response) { 
          return res.status(200).json({ message: 'Bank Account Verified', data: response });
        } else {
          return res.status(400).json({ message: 'Bank Account Verification Failed', data: response });
        }
      } catch (error) {
        console.error('Error processing response:', error);
        return res.status(500).json({ message: 'Something Went Wrong' });
      }
    });
  });

  reqApi.end();
});
// ----------------------------------------------------------------------------
module.exports = router;