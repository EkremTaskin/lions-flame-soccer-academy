import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/lions-flame-logo.png';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsActive(!isActive);
  const closeMenu = () => setIsActive(false);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${isActive ? 'active' : ''}`}>
      <div className="container nav-content">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src={logo} alt="Lions Flame Soccer Academy" className="nav-logo-img" />
        </Link>

        <div className={`nav-menu ${isActive ? 'active' : ''}`}>
          <ul className="nav-links">
            <li><Link to="/#home" onClick={closeMenu}>Home</Link></li>
            <li><Link to="/#about" onClick={closeMenu}>Head Coach</Link></li>
            <li><Link to="/#programs" onClick={closeMenu}>Programs</Link></li>
            <li><Link to="/#gallery" onClick={closeMenu}>Gallery</Link></li>
            <li><Link to="/#testimonials" onClick={closeMenu}>Stories</Link></li>
          </ul>
          <Link to="/#contact" className="btn-primary mobile-btn" onClick={closeMenu}>Contact us!</Link>
        </div>

        <button className={`hamburger ${isActive ? 'active' : ''}`} onClick={toggleMenu} aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <Link to="/#contact" className="btn-primary desktop-btn">Contact us!</Link>
      </div>
    </nav>
  );
};

export default Navbar;
