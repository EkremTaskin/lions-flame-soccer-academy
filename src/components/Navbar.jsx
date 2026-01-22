import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-content">
        <a href="/" className="logo">
          <img src="/academy-logo-transparent.png" alt="Lions Flame" className="nav-logo-img" />
          <div className="logo-text">
            LION'S FLAME
            <span>SOCCER ACADEMY</span>
          </div>
        </a>
        <ul className="nav-links">
          <li><a href="/#home">Home</a></li>
          <li><a href="/#about">Head Coach</a></li>
          <li><a href="/#programs">Programs</a></li>
          <li><a href="/#gallery">Gallery</a></li>
          <li><a href="/#testimonials">Stories</a></li>
        </ul>
        <a href="/#contact" className="btn-primary">Contact us!</a>
      </div>
    </nav>
  );
};

export default Navbar;
