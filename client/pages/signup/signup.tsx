"use client";
import styles from "./signup.module.css";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import EmailVerify from "../verify/emailVerify";
import PhoneVerify from "../verify/phoneVerify";
import AadharVerify from "../verify/aadharVerify";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNum, setPhone] = useState("");
  const [aadharNum, setAadhar] = useState("");
  const [DOB, setDob] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const router = useRouter();
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
        phoneNum,
        aadharNum,
        DOB,
      });
      console.log(res);
      alert("successfully registered");
      setIsRegistered(true);
    } catch (err: any) {
      console.error("Axios error:", err.response?.data || err.message);
      alert(
        "Registration failed: " + (err.response?.data?.msg || "Unknown error")
      );
    }
  };

  return (
    <>
      {!isRegistered ? (
        <div className={styles.registerDiv}>
          <h1>Registration form</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              className={styles.registerInput}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name:"
            />
            <input
              type="email"
              name="email"
              className={styles.registerInput}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your Email id:"
            />
            <input
              type="password"
              name="password"
              className={styles.registerInput}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password:"
            />
            <input
              type="tel"
              name="phoneNum"
              pattern="^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$"
              className={styles.registerInput}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="Enter your phone number:"
            />
            <input
              type="text"
              name="aadharNum"
              className={styles.registerInput}
              onChange={(e) => setAadhar(e.target.value)}
              required
              placeholder="Enter your Aadhar number:"
            />
            <input
              type="date"
              name="DOB"
              className={styles.registerInput}
              onChange={(e) => setDob(e.target.value)}
              required
              placeholder="Enter your date of birth:"
            />
            <button type="submit" className={styles.registerBtn}>
              Register
            </button>
          </form>
          <p>
            Already have an account <Link href="/pages/login">Login</Link>
          </p>
        </div>
      ) : (
        <>
          <div className={styles.row}>
            <EmailVerify email={email} />
            <PhoneVerify phoneNum={phoneNum} />
            <AadharVerify aadharNum={aadharNum} />
          </div>
        </>
      )}
    </>
  );
}
