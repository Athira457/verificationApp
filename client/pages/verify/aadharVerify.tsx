import React, { useState } from 'react';
import styles from './verify.module.css';
import axios from "axios";
import { useRouter } from 'next/navigation';

interface AadharVerifyProps {
    aadharNum: string;
}

const AadharVerification: React.FC<AadharVerifyProps> = ({ aadharNum }) => {
    const [verifyResponse, setVerifyResponse] = useState('');
    const router = useRouter();
    const verifyAadhar = async () => {
        try {          
            const res = await axios.post('http://localhost:5000/api/auth/verify-aadhar', { aadharNum });
            console.log(res,'res');
            
            if (res.data.message === 'Aadhar Verified') {
                setVerifyResponse('Aadhaar number verified successfully');
                router.push('')
            
            } else {
                setVerifyResponse('Failed to verify Aadhaar number');
            }
        } catch (err:any) {
            console.error('Error verifying Aadhaar:', err.response?.data || err.message);
            setVerifyResponse('Aadhaar verification failed: ' + (err.response?.data?.message || 'Unknown error'));
        }
    }; 

    return (
        <div className={styles.container}>
            <h2>Aadhar Number Verification</h2>
            <input
                type="text"
                placeholder="Enter your Aadhar number"
                value={aadharNum}
                className={styles.VerifyInput}
                disabled // Disable the input as phone number is passed via props
            />
            <button onClick={verifyAadhar} className={styles.verifyBtn}>Verify Aadhar</button>
            <p className={styles.message}>{verifyResponse}</p>
        </div>
    );
};

export default AadharVerification;