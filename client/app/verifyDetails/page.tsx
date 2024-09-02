"use client";
import styles from './login.module.css';
import Link from "next/link";
import Gst from './components/verifyGst/gst'
import Address from './components/addressLookup/address'
import Pan from './components/verifyPan/pan'

export default function Dashboard() {
    return (
        <div>
            <Gst />
            <Address />
            <Pan />
        </div>
);
}