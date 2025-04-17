import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Token:", token);
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/api/users/reset-password/${token}', { password });
            setMessage(response.data.message);
            setError('');
            setTimeout(() => navigate('/login'), 3000); // Redirect after success
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password.');
            setMessage('');
        }
    };

    useEffect(() => {
        console.log("Reset Token:", token); // Verify token is received
    }, [token]);

    return (
        <div className="reset-password-container">
            <h2>Reset Your Password</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="reset-password-form">
                <div className="form-group">
                    <label htmlFor="password">New Password:</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password:</label>
                    <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <button type="submit" className="reset-btn">Reset Password</button>
            </form>
        </div>
    );
}

export default ResetPassword;