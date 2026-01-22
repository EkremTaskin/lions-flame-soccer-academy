import logo from '../assets/lions-flame-logo.png';
import './Contact.css';

const Contact = () => {
    return (
        <section id="contact" className="contact-section">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Contact <span className="text-primary">Us!</span></h2>
                    <p className="section-subtitle">Have questions? Reach out to our academy staff directly.</p>
                </div>

                <div className="contact-info-only">
                    <div className="info-grid">
                        <div className="info-card">
                            <span className="icon">📍</span>
                            <h3>Our Academy</h3>
                            <p>Location: Coming Soon</p>
                        </div>

                        <div className="info-card">
                            <span className="icon">📞</span>
                            <h3>Call Us</h3>
                            <p>+1 (555) 123-4567</p>
                            <p className="sub-info">Available Mon-Fri, 9am - 6pm</p>
                        </div>

                        <div className="info-card">
                            <span className="icon">✉️</span>
                            <h3>Email</h3>
                            <p>info@lionsflame.academy</p>
                            <p className="sub-info">Response within 24 hours</p>
                        </div>
                    </div>

                    <div className="social-container text-center">
                        <h3>Follow The Pride</h3>
                        <div className="social-links">
                            <a href="#" className="social-icon">Instagram</a>
                            <a href="#" className="social-icon">Facebook</a>
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
                            <li><a href="/#home">Home</a></li>
                            <li><a href="/#about">Head Coach</a></li>
                            <li><a href="/#gallery">Gallery</a></li>
                            <li><a href="/#testimonials">Stories</a></li>
                            <li><a href="/#faq">FAQ</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h3>Training</h3>
                        <ul>
                            <li><a href="/book?program=One-on-One">One-on-One</a></li>
                            <li><a href="/book?program=Small Group">Small Group</a></li>
                            <li><a href="/book?program=Large Group">Large Group</a></li>
                            <li><a href="/book">Schedule Trial</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h3>Contact Us</h3>
                        <ul className="footer-contact-list">
                            <li><span>📍</span> Location: Coming Soon</li>
                            <li><span>📞</span> +1 (555) 123-4567</li>
                            <li><span>✉️</span> info@lionsflame.academy</li>
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
