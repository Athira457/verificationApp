"use client";
import styles from './pan.module.css';
import React, { useState } from 'react';
import axios from "axios";

export default function Pan() {
    const [panNum, setPanNum] = useState('');
    const [verifyResponse, setVerifyResponse] = useState('');
    const PanVerification = async (e:any) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/verify-pan', { panNum });
            console.log(res); 
            setVerifyResponse('PAN number verified');
        } catch (error) {
            setVerifyResponse('Error Verifing PAN number');
        }
    };

    return (
        <div className={styles.panDiv}>

             <form>
                <input type='text' name="panno" onChange={(e) => setPanNum(e.target.value)} placeholder='Enter your PAN Number:'  className={styles.inputPan}/>
                <button onClick={PanVerification} type='submit' className={styles.verifyBtn}>Verify</button>
                <p className={styles.message}>{verifyResponse}</p>
            </form>     
        </div>
);
}