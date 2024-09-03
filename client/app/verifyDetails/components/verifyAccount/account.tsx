"use client";
import styles from './account.module.css';
import React, { useState } from 'react';
import axios from "axios";

export default function Account() {
    const [bank_account_no, setACNum] = useState('');
    const [bank_ifsc_code, setIfscCode] = useState('');
    const [verifyResponse, setVerifyResponse] = useState('');
    const AccountVerification = async (e:any) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/verify-bank-account', { bank_account_no, bank_ifsc_code });
            const id = res.data.data.request_id; 
            const details= await axios.get(`http://localhost:5000/api/auth/verify-bank-account/${id}`)
            console.log('details',details)
            setVerifyResponse('Bank Account verified');
        } catch (error) {
            setVerifyResponse('Error Verifing Bank Account');
        }
    };

    return (
        <div className={styles.AccountDiv}>
            <h3>Account Number Verification</h3>
             <form>
                <input type='text' name="acno" onChange={(e) => setACNum(e.target.value)} placeholder='Enter your Bank Account Number:'  className={styles.inputAccount}/>
                <input type='text' name="ifsc" onChange={(e) => setIfscCode(e.target.value)} placeholder='Enter Bank IFSC Code:'  className={styles.inputAccount}/>
                <button onClick={AccountVerification} type='submit' className={styles.verifyBtn}>Verify</button>
                <p className={styles.message}>{verifyResponse}</p>
            </form>     
        </div>
);
}