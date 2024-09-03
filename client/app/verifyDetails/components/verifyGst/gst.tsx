"use client";
import styles from './gst.module.css';
import React, { useState } from 'react';
import axios from "axios";

export default function Gst() {
    const [gstNum, setGstNum] = useState('');
    const [verifyResponse, setVerifyResponse] = useState('');
    const GstVerification = async (e:any) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/verify-gst', { gstin : gstNum });
            console.log(res); 
            setVerifyResponse('GST verified');
        } catch (error) {
            setVerifyResponse('Error Verifing GST');
        }
    };

    return (
        <div className={styles.gstDiv}>

             <form>
                <h3>GST Verification</h3>
                <input type='text' name="gstno" onChange={(e) => setGstNum(e.target.value)} placeholder='Enter your Gst Number:'  className={styles.inputGst}/>
                <button onClick={GstVerification} type='submit' className={styles.verifyBtn}>Verify</button>
                <p className={styles.message}>{verifyResponse}</p>
            </form>     
        </div>
);
}