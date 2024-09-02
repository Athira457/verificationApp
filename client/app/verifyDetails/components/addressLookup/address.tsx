"use client";
import styles from './address.module.css';
import React, { useState } from 'react';
import axios from "axios";

export default function Address() {
    const [pinNum, setPinNum] = useState('');
    const [verifyResponse, setVerifyResponse] = useState('');
    const PinVerification = async (e:any) => {
        e.preventDefault();
        try {
            const res = await axios.get(`http://localhost:5000/api/auth/verify-pincode/${pinNum}`);
            console.log(res); 
            setVerifyResponse('PIN number verified');
        } catch (error) {
            setVerifyResponse('Error Verifing PIN number');
        }
    };

    return (
        <div className={styles.addressDiv}>

             <form>
                <input type='text' name="pinno" onChange={(e) => setPinNum(e.target.value)} placeholder='Enter PIN Number:'  className={styles.inputPin}/>
                <button onClick={PinVerification} type='submit' className={styles.verifyBtn}>Verify</button>
                <p className={styles.message}>{verifyResponse}</p>
            </form>     
        </div>
);
}