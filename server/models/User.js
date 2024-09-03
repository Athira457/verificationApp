const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNum: { type: String, required: true },
  aadharNum: { type: String, required: true },
  DOB: { type: Date, required: true },
  password: { type: String, required: true },
  isEmailVerified: { type: Boolean, default: false },
  otp: { type: Number },
  otpPhn: { type: Number },
  EmailOtpExpires: {
    type: Date,
    default: Date.now,
    index: { expires: 900 }, // After 15 minutes, it will be deleted from database automatically
  },
  isPhoneVerified: { type: Boolean, default: false },
  PhoneOtpExpires: { type: Date },
  isAadharVerified: { type: Boolean, default: false },
  gstin: { type: String, required: false },
  isGstVerified: { type: Boolean, default: false },
  panNum: { type: String, required: false },
  isPanVerified: { type: Boolean, default: false },
  PinNum: { type: String, required: false },
  isPinVerified: { type: Boolean, default: false },
  accountNum: { type: String, required: false },
  isAccountVerified: { type: Boolean, default: false },
});

const User = mongoose.model("Users", userSchema);

module.exports = User;
