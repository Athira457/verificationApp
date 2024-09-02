import React, { useState } from 'react';
import styles from './verify.module.css';
import axios from "axios";

interface PhoneVerifyProps {
    phoneNum: string;
}

const PhoneOTPVerification: React.FC<PhoneVerifyProps> = ({ phoneNum }) => {
    const [otpPhn, setOtpPhn] = useState('');
    const [verifyResponse, setVerifyResponse] = useState('');
    const [generateResponse, setGenerateResponse] = useState('');

    const generateOTP = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/generate-otp-sms', { phoneNum });
            console.log(res); 
            setGenerateResponse('OTP sent successfully');
        } catch (error) {
            setGenerateResponse('Error generating OTP');
        }
    };

    const verifyOTP = async () => {
        try {
            console.log(otpPhn);           
            const res = await axios.post('http://localhost:5000/api/auth/verify-otp-sms', { phoneNum, otpPhn });
            console.log(res); 
            setVerifyResponse('OTP verified');
        } catch (error) {
            console.log(error); 
            setVerifyResponse('Error verifying OTP');
        }
    };

    return (
        <div className={styles.container}>
            <h2>Phone Number Verification</h2>
            <input
                type="text"
                placeholder="Enter your phone number"
                value={phoneNum}
                className={styles.VerifyInput}  
            />
            <button onClick={generateOTP} className={styles.verifyBtn}>Generate OTP</button>
            <p className={styles.message}>{generateResponse}</p>
            <input
                type="text"
                placeholder="Enter OTP"
                value={otpPhn}
                onChange={(e) => setOtpPhn(e.target.value)}
                className={styles.VerifyInput}
            />
            <button onClick={verifyOTP} className={styles.verifyBtn}>Verify OTP</button>
            <p className={styles.message}>{verifyResponse}</p>
        </div>
    );
};

export default PhoneOTPVerification;
