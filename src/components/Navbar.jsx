import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/lions-flame-logo.png';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        await signOut(auth);
        navigate('/');
    } catch (error) {
        console.error('Logout error', error);
    }
  };

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
            <li><Link to="/#testimonials" onClick={(e) => handleLinkClick(e, '#testimonials')}>Stories</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            {isAdmin && <li><Link to="/admin">Admin</Link></li>}
            {currentUser ? (
              <li><Link to="/account">Account</Link></li>
            ) : (
              <li><Link to="/login">Login</Link></li>
            )}
          </ul>
          <Link to="/#contact" className="btn-primary mobile-btn" onClick={(e) => handleLinkClick(e, '#contact')}>Contact us!</Link>
        </div>

        <button className={`hamburger ${isActive ? 'active' : ''}`} onClick={toggleMenu} aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <Link to="/#contact" className="btn-primary desktop-btn" onClick={(e) => handleLinkClick(e, '#contact')}>Contact us!</Link>
      </div>
    </nav>
  );
};

export default Navbar;
