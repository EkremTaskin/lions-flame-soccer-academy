import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/lions-flame-logo.png';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const UserIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="8" r="3.25" />
    <path d="M5.5 19c1.2-3.2 3.4-4.8 6.5-4.8s5.3 1.6 6.5 4.8" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6.5 8.5h11l-.8 10.2a2 2 0 0 1-2 1.8H9.3a2 2 0 0 1-2-1.8L6.5 8.5Z" />
    <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
  </svg>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const { currentUser, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsActive(!isActive);
  const closeMenu = () => setIsActive(false);

  const handleLinkClick = (e, targetId) => {
    closeMenu();
    // If we're already on the home page, handle scroll manually
    if (window.location.pathname === '/' || window.location.pathname === '/lions-flame-soccer-academy/') {
      const element = document.getElementById(targetId.replace('#', ''));
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, null, targetId);
      }
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${isActive ? 'active' : ''}`}>
      <div className="container nav-content">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src={logo} alt="Lions Flame Soccer Academy" className="nav-logo-img" />
        </Link>

        <div className={`nav-menu ${isActive ? 'active' : ''}`}>
          <ul className="nav-links">
            <li><Link to="/#home" onClick={(e) => handleLinkClick(e, '#home')}>Home</Link></li>
            <li><Link to="/#about" onClick={(e) => handleLinkClick(e, '#about')}>Coach</Link></li>
            <li><Link to="/#programs" onClick={(e) => handleLinkClick(e, '#programs')}>Programs</Link></li>
            <li><Link to="/#gallery" onClick={(e) => handleLinkClick(e, '#gallery')}>Gallery</Link></li>
            {isAdmin && <li><Link to="/admin">Admin</Link></li>}
          </ul>
          <Link to="/book" className="btn-primary mobile-btn" onClick={closeMenu}>Book Session</Link>
        </div>

        <div className="nav-actions">
          {currentUser ? (
            <Link to="/account" className="nav-user-link">
              <UserIcon /> Account
            </Link>
          ) : (
            <Link to="/login" className="nav-user-link">
              <UserIcon /> Log In
            </Link>
          )}
          <Link to="/shop" className="nav-cart-btn" aria-label="Shop coming soon">
            <ShoppingBagIcon />
          </Link>
          
          <button className={`hamburger ${isActive ? 'active' : ''}`} onClick={toggleMenu} aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <Link to="/book" className="btn-primary desktop-btn">Book Session</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
