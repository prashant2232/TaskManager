import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/users/forgot-password', { email });
            setMessage(response.data.message); 
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>Forgot Your Password?</h2>
            <p>Enter the email address associated with your account.</p>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="forgot-password-form">
                <div className="form-group">
                    <label htmlFor="email">Email Address:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">Send Reset Link</button>
                <button type="button" className="back-btn" onClick={() => navigate('/login')}>Back to Login</button>
            </form>
        </div>
    );
}

export default ForgotPassword;