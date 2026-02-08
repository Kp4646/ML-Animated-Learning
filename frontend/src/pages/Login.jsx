import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './Auth.css';

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            navigate('/');
        } catch (err) {
            setError('Failed to log in: ' + err.message);
        }

        setLoading(false);
    }

    return (
        <motion.div
            className="auth-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="auth-card"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
            >
                <h2 className="auth-title">Welcome Back</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" ref={emailRef} required className="form-input" placeholder="Enter your email" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" ref={passwordRef} required className="form-input" placeholder="Enter your password" />
                    </div>
                    <button disabled={loading} className="auth-button" type="submit">
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
                <div className="auth-link">
                    Need an account? <Link to="/signup">Sign Up</Link>
                </div>
            </motion.div>
        </motion.div>
    );
}
