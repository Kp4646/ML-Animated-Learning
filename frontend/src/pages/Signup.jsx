import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './Auth.css';

export default function Signup() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match');
        }

        try {
            setError('');
            setLoading(true);

            const additionalData = {
                firstName: firstNameRef.current.value,
                lastName: lastNameRef.current.value,
                university: universityRef.current.value,
                dateOfBirth: {
                    day: dayRef.current.value,
                    month: monthRef.current.value,
                    year: yearRef.current.value
                }
            };

            await signup(emailRef.current.value, passwordRef.current.value, additionalData);
            navigate('/');
        } catch (err) {
            setError('Failed to create an account: ' + err.message);
        }

        setLoading(false);
    }

    // Generate arrays for dropdowns
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const universityRef = useRef();
    const dayRef = useRef();
    const monthRef = useRef();
    const yearRef = useRef();

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
                style={{ maxWidth: '500px' }} // Wider card for more fields
            >
                <h2 className="auth-title">Create Account</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input type="text" ref={firstNameRef} required className="form-input" placeholder="First Name" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Last</label>
                            <input type="text" ref={lastNameRef} required className="form-input" placeholder="Last Name" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Date of Birth</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr', gap: '0.5rem' }}>
                            <select ref={dayRef} required className="form-input">
                                <option value="">Day</option>
                                {days.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <select ref={monthRef} required className="form-input">
                                <option value="">Month</option>
                                {months.map((m, i) => <option key={i} value={m}>{m}</option>)}
                            </select>
                            <select ref={yearRef} required className="form-input">
                                <option value="">Year</option>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">University Name</label>
                        <input type="text" ref={universityRef} required className="form-input" placeholder="Enter your university" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" ref={emailRef} required className="form-input" placeholder="Enter your email" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" ref={passwordRef} required className="form-input" placeholder="Create a password" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input type="password" ref={passwordConfirmRef} required className="form-input" placeholder="Confirm your password" />
                    </div>

                    <button disabled={loading} className="auth-button" type="submit">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <div className="auth-link">
                    Already have an account? <Link to="/login">Log In</Link>
                </div>
            </motion.div>
        </motion.div>
    );
}
