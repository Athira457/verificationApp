"use client";
import styles from './login.module.css';
import Link from "next/link";
import Gst from './components/verifyGst/gst'
import Address from './components/addressLookup/address'
import Pan from './components/verifyPan/pan'
import Account from './components/verifyAccount/account'

export default function Dashboard() {
    return (
        <div>
            <Gst />
            <Address />
            <Pan />
            <Account />
        </div>
);
}