import { useState } from "react";
import { auth } from "../firebase.js";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function SignUp({openSignUp, setOpenSignUp}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleGoogleSignUp = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            // User signed up successfully
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main className="signup-page d-flex justify-content-center align-items-center ">
            <div className="signup-card text-center col-lg-2 col-md-2 col-sm-6">

                <img
                    src="./public/app-logo.png"
                    alt="Logo"
                    className="signup-logo"
                />

                <form className="d-flex flex-column gap-3">

                    <input
                        className="form-control"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className="form-control"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type="button"
                        className="btn btn-outline-light d-flex align-items-center w-100"
                        onClick={handleGoogleSignUp}
                    >
                       <img src="./public/google.png" style={{height: "22px", width: "auto"}} className="img-fluid" alt="Google Logo" /> Sign Up with Google
                    </button>
                  
                      <button
                        type="button"
                        className="btn btn-outline-light  d-flex  align-items-center w-100"
                        onClick={handleGoogleSignUp}
                    >
                        <img src="./public/apple-logo.png" style={{height: "30px", width: "auto"}} className="img-fluid" alt="Apple Logo" /> Sign Up with Apple
                    </button>

                    <div className="d-flex gap-2">

                        <button
                            type="button"
                            className="btn btn-outline-light flex-fill"
                        >
                            Log In
                        </button>

                        <button
                            type="button"
                            className="btn btn-light flex-fill"
                        >
                            Sign Up
                        </button>
                      
                    </div>
                     <button onClick={() => setOpenSignUp(false)}>
                           Continue Without an Account
                    </button>

                </form>

            </div>
        </main>
    );
}