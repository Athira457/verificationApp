import styles from './login.module.css';
import Link from "next/link";

export default function Login() {
    return (
        <div className={styles.loginDiv}>
            <h1>Login</h1>
            <form>
                <input type='email' name="email" placeholder='Enter your Email:' className={styles.inputLogin}/>
                <input type='password' name="password" placeholder='Enter your Password:' className={styles.inputLogin}/>
                <button type='submit' className={styles.loginBtn}>Login</button>
            </form>
            <p>Not a member?<Link href="/">Regiser Now</Link></p>
        </div>

);
}