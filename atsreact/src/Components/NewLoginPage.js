import React from 'react';
import styles from '../login-04/NewLoginPage.module.css'; // Make sure the path is correct

const NewLoginPage = () => {
  return (
    <form className={styles.myForm}>
        <div className={styles.loginWelcomeRow}>
            <a href="" title="Logo">
                {/* Update the path to your logo as needed */}
                <img src="../login-04/assets/storeify.png" alt="Logo" className={styles.logo}/>
            </a>
            <h1>Welcome back 👏</h1>
            <p>Please enter your details!</p>
        </div>
        <div className={styles.inputWrapper}>
            <input type="email" id="email" name="email" className={styles.inputField} placeholder="Your Email" required />
            <label htmlFor="email" className={styles.inputLabel}>Email:</label>
        </div>
        <div className={styles.inputWrapper}>
            <input id="password" type="password" className={styles.inputField} placeholder="Your Password" required />
            <label htmlFor="password" className={styles.inputLabel}>Password</label>
        </div>
        <button type="submit" className={styles.myFormButton}>Login</button>
        {/* Consider adding the rest of your form elements here */}
    </form>
  );
};

export default NewLoginPage;
