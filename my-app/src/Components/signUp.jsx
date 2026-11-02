import { useState } from "react";
import { auth } from "../firebase.js";
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function SignUp({ openSignUp, setOpenSignUp, setUser, onContinueWithoutAccount, onSignedIn }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleGoogleSignUp = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            // User signed up successfully
            console.log(result);
            onSignedIn?.();
            setUser(result.user); // Update user state
            setOpenSignUp(false); // Close the signup modal
        } catch (error) {
            console.error(error);
        }
    };
    const signUpEmailAndPassword = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // User signed up successfully
            console.log(userCredential);
            onSignedIn?.();
            setUser(userCredential.user); // Update user state
            setOpenSignUp(false); // Close the signup modal
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to sign up. Please check your credentials.");
        }
    };
    const logInWithEmailAndPassword = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
            // User logged in successfully
            console.log(userCredential);
            onSignedIn?.();
            setUser(userCredential.user); // Update user state
            setOpenSignUp(false); // Close the signup modal
        } catch (error) {
            console.error(error.code);
            switch (error.code) {
                case "auth/invalid-email":
                    setErrorMessage("Invalid email format.");
                    break;

                case "auth/invalid-credential":
                case "auth/user-not-found":
                case "auth/wrong-password":
                    setErrorMessage(
                        "Incorrect email or password. If you registered with Google, use the Google sign-in button."
                    );
                    break;

                default:
                    setErrorMessage("Failed to log in. Please check your credentials.");
            }
        }
    }

    return (
        <main className="signup-page d-flex justify-content-center align-items-center">
            <div className="signup-card text-center">

                <img
                    src={`${import.meta.env.BASE_URL}app-logo.png`}
                    alt="Logo"
                    className="signup-logo"
                />

                <form
                    className="signup-form d-flex flex-column gap-3"
                    onSubmit={(event) => {
                        event.preventDefault();
                        logInWithEmailAndPassword();
                    }}
                >

                    <input
                        className="form-control"
                        type="email"
                        placeholder="Email"
                        aria-label="Email address"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className="form-control"
                        type="password"
                        placeholder="Password"
                        aria-label="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type="button"
                        className="btn btn-outline-light d-flex align-items-center justify-content-center gap-2 w-100"
                        onClick={handleGoogleSignUp}
                    >
                        <img src={`${import.meta.env.BASE_URL}google.png`} style={{ height: "22px", width: "auto" }} className="img-fluid" alt="Google Logo" /> Sign Up with Google
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline-light d-flex align-items-center justify-content-center gap-2 w-100"
                        disabled
                        title="Apple sign-in is coming soon"
                    >
                        <img src={`${import.meta.env.BASE_URL}apple-logo.png`} style={{ height: "30px", width: "auto" }} className="img-fluid" alt="" /> Apple Sign-In Coming Soon
                    </button>

                    <div className="signup-divider" aria-hidden="true"><span>or</span></div>

                    <div className="d-flex gap-2">

                        <button
                            type="button"
                            className="btn btn-outline-light flex-fill"
                            onClick={logInWithEmailAndPassword}
                        >
                            Log In
                        </button>

                        <button
                            type="button"
                            className="btn btn-light flex-fill"
                            onClick={signUpEmailAndPassword}
                        >
                            Sign Up
                        </button>

                    </div>
                    <button
                        type="button"
                        className="btn btn-outline-light w-100"
                        onClick={() => {
                            onContinueWithoutAccount?.();
                            setOpenSignUp(false);
                        }}
                    >
                        Continue Without an Account
                    </button>
                    {errorMessage && <p className="text-danger mb-0" role="alert">{errorMessage}</p>}

                </form>

            </div>
        </main>
    );
}
