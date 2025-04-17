import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; 
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const googleClientId = "291614817251-pqj84drfv4heh8ctnhqmnsiq8596kkne.apps.googleusercontent.com"; 

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:5000/api/users/login", {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);

            if (rememberMe) {
                localStorage.setItem("rememberedEmail", email);
            } else {
                localStorage.removeItem("rememberedEmail");
            }

            navigate("/dashboard");

        } catch (err) {
            setError("Invalid email or password");
        }
    };

    const googleSuccess = async (credentialResponse) => {
        if (credentialResponse && credentialResponse.credential) {
            try {
                const googleToken = credentialResponse.credential;
                const res = await axios.post("http://localhost:5000/api/users/google-login", {
                    tokenId: googleToken,
                });

                localStorage.setItem("token", res.data.token);
                navigate("/dashboard");
            } catch (error) {
                console.error("Google login failed:", error);
                setError("Google login failed");
            }
        } else {
            console.error("Google login failed: No credential returned");
            setError("Google login failed");
        }
    };

    const googleFailure = (error) => {
        console.error("Google login failed:", error);
        setError("Google login failed");
    };

    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    return (
        <GoogleOAuthProvider clientId={googleClientId}> 
            <div className="login-container">
                <div className="login-box">
                    <div className="left-section">
                        <h2>Login</h2>
                        <label>
                            Doesn't have an account yet?
                            <Link to="/signup" className="signup-btn"> Sign Up</Link>
                        </label>

                        <form onSubmit={handleLogin} className="form">
                            <div className="form-group gap email">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group forgot">
                                <label>Password <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link></label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="options">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    Remember Me
                                </label>
                            </div>

                            {error && <p className="error-message">{error}</p>}

                            <button type="submit" className="login-btn">Login</button>

                        </form>

                        <label className="choose">or login with</label>
                        <GoogleLogin
                            onSuccess={googleSuccess}
                            onError={googleFailure}
                            render={({ onClick, disabled }) => (
                                <button
                                    onClick={onClick}
                                    disabled={disabled}
                                    className="google-btn"
                                >
                                    <img src="./assets/logo.png" alt="Google logo" />
                                    Google
                                </button>
                            )}
                        />
                    </div>

                    <div className="right-section">
                        <img src="./assets/image.png" alt="Task Manager" />
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}

export default Login;