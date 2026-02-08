import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Navbar.css';

function Navbar() {
  
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
        
        
      </div>
    </motion.nav>
  );
}

export default Navbar;
