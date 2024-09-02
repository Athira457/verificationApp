import React, { useState } from 'react';
import styles from './verify.module.css';
import axios from "axios";

interface EmailVerifyProps {
    email: string;
}

const OTPVerification: React.FC<EmailVerifyProps> = ({email}) => {
    // const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [verifyResponse, setVerifyResponse] = useState('');
    const [generateResponse, setGenerateResponse] = useState('');

    const generateOTP = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/generate-otp', { email });
            console.log(res); 
            setGenerateResponse('OTP sent successfully');
        } catch (error) {
            setGenerateResponse('Error generating OTP');
        }
    };

    const verifyOTP = async () => {
        try {
            console.log(otp);         
            const res = await axios.post('http://localhost:5000/api/auth/verify-otp', {email, otp});
            console.log(res); 
            setVerifyResponse('OTP verified');
        } catch (error) {
            console.log(error); 
            setVerifyResponse('Error verifying OTP');
        }
    };

    return (
        <div className={styles.container}>
            
            <h2>Email Verification</h2>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                // onChange={(e) => setEmail(e.target.value)}
                className={styles.VerifyInput}
            />
            <button onClick={generateOTP} className={styles.verifyBtn}>Generate OTP</button>
            <p className={styles.message}>{generateResponse}</p>
            <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={styles.VerifyInput}
            />
            <button onClick={verifyOTP} className={styles.verifyBtn}>Verify OTP</button>
            <p className={styles.message}>{verifyResponse}</p>
        </div>
    );
};


export default OTPVerification;
