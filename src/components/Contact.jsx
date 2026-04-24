import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitContactForm } from '../utils/bookingApi';
import logo from '../assets/lions-flame-logo.png';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            await submitContactForm(formData);
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus('idle'), 5000);
        } catch (err) {
            console.error('Submission error:', err);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };
    return (
        <section id="contact" className="contact-section">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Contact <span className="text-primary">Us!</span></h2>
                    <p className="section-subtitle">Have questions? Reach out to our academy staff directly.</p>
                </div>

                <div className="contact-layout">
                    <div className="contact-form-container">
                        <h3>Send Us a Message</h3>
                        <form onSubmit={handleSubmit} className="contact-form text-left">
                            <div className="form-group">
                                <label>Your Name</label>
                                <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required className="form-input" />
                            </div>
                            <div className="form-group">
                                <label>Your Email</label>
                                <input type="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required className="form-input" />
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <textarea name="message" placeholder="How can we help you?" rows="5" value={formData.message} onChange={handleChange} required className="form-input"></textarea>
                            </div>
                            <button type="submit" className="btn-primary full-width success-btn mt-2" disabled={status === 'submitting'}>
                                {status === 'submitting' ? 'Sending...' : 'Send Message'}
                            </button>
                            {status === 'success' && <div className="form-message form-success mt-3 text-center">Message sent successfully! We'll get back to you soon.</div>}
                            {status === 'error' && <div className="form-message form-error mt-3 text-center" style={{color: 'red'}}>Failed to send message. Please try again.</div>}
                        </form>
                    </div>

                    <div className="contact-info-container">
                        <div className="info-grid">
                        <div className="info-card">
                            <span className="icon">📍</span>
                            <div className="info-card-content">
                                <h3>Academy Location</h3>
                                <p>Coming Soon</p>
                            </div>
                        </div>

                        <div className="info-card">
                            <span className="icon">📞</span>
                            <div className="info-card-content">
                                 <h3>Call Us</h3>
                                <p><a href="tel:+14692230058" className="contact-link">+1 (469) 223-0058</a></p>
                                <p className="sub-info">Mon-Fri, 9am - 6pm</p>
                            </div>
                        </div>

                        <div className="info-card">
                            <span className="icon">✉️</span>
                            <div className="info-card-content">
                                 <h3>Email</h3>
                                <p><a href="mailto:lionsflamesocceracademy@gmail.com" className="contact-link">lionsflamesocceracademy@gmail.com</a></p>
                                <p className="sub-info">Replies in 24 hrs</p>
                            </div>
                        </div>
                    </div>

                        <div className="social-container text-center">
                            <h3>Follow The Pride</h3>
                            <div className="social-links">
                                <a href="https://www.instagram.com/lionsflamesocceracademy/" target="_blank" rel="noopener noreferrer" className="social-icon">Instagram</a>
                                <a href="https://www.facebook.com/profile.php?id=61587896511048&mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="social-icon">Facebook</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="footer-v2">
                <div className="container footer-grid">
                    <div className="footer-col brand-col">
                        <div className="footer-logo">
                            <img src={logo} alt="Lions Flame Soccer Academy" className="footer-logo-img" style={{ height: '70px', marginBottom: '1rem' }} />
                        </div>
                        <p className="footer-tagline">Igniting the next generation of football stars through elite coaching and character development.</p>
                    </div>

                    <div className="footer-col">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><Link to="/#home">Home</Link></li>
                            <li><Link to="/#about">Head Coach</Link></li>
                            <li><Link to="/#gallery">Gallery</Link></li>
                            <li><Link to="/#testimonials">Stories</Link></li>
                            <li><Link to="/#faq">FAQ</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h3>Training</h3>
                        <ul>
                            <li><Link to="/book?program=One-on-One">One-on-One</Link></li>
                            <li><Link to="/book?program=Small Group">Small Group</Link></li>
                            <li><Link to="/book?program=Large Group">Large Group</Link></li>
                            <li><Link to="/book">Schedule Trial</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h3>Contact Us</h3>
                        <ul className="footer-contact-list">
                            <li><span>📍</span> Location: Coming Soon</li>
                            <li><span>📞</span> <a href="tel:+14692230058">+1 (469) 223-0058</a></li>
                            <li><span>✉️</span> <a href="mailto:lionsflamesocceracademy@gmail.com">lionsflamesocceracademy@gmail.com</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="container">
                        <p>&copy; 2026 Lion's Flame Soccer Academy. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </section>
    );
};

export default Contact;
