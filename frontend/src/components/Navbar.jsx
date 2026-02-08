import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './Navbar.css';

function Navbar() {
  const { currentUser, userProfile, logout } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleLogout() {
    setError('');
    try {
      await logout();
      navigate('/login');
    } catch {
      setError('Failed to log out');
    }
  }

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-container">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="AlgoViz-Logo" />
          <span className="logo-text">Animated Learning</span>
        </Link>

        <div className="nav-auth-container">
          {currentUser ? (
            <div className="user-menu">
              <span className="user-email">
                {userProfile && userProfile.firstName
                  ? `Hi! ${userProfile.firstName} ${userProfile.lastName || ''}`
                  : currentUser.email}
              </span>
              <button variant="link" onClick={handleLogout} className="logout-btn">
                Log Out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-btn nav-btn-login">
                Log In
              </Link>
              <Link to="/signup" className="nav-btn nav-btn-signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
