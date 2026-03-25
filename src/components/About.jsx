import React from 'react';
import coachImg from '../assets/coach_new.jpg';
import './About.css';

const About = () => {
    return (
        <section id="about" className="about-section">
            <div className="container about-container">
                <div className="about-image-wrapper">
                    <img src={coachImg} alt="Head Coach Caglayan Asim Saglik" className="about-image" />
                </div>
                <div className="about-text">
                    <h2 className="section-title">Meet Our <span className="text-primary">Head Coach</span></h2>
                    <p>
                        Lion's Flame Academy is led by a dedicated professional committed to technical excellence and player growth.
                    </p>
                    <div className="coach-info">
                        <h3>Coach Caglayan Asim Saglik</h3>
                        <p className="coach-title">Head of Player Development</p>
                        <p className="coach-bio">
                            Caglayan Asim Saglik is a certified US Soccer D License coach with extensive experience in youth player development.
                            Passionate about fostering technical skills, game understanding, and teamwork,
                            he creates a positive and engaging environment for players of all ages. Dedicated to
                            helping young athletes reach their full potential, Caglayan combines proven coaching methods
                            with a love for the game to inspire growth both on and off the field.
                        </p>
                        
                        <div className="coached-teams mt-4">
                            <h4 className="text-secondary" style={{fontSize: '1.2rem', marginBottom: '0.8rem'}}>Teams Coached:</h4>
                            <ul style={{listStyle: 'none', padding: 0}}>
                                <li style={{marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                    <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>→</span> 
                                    <span>WYSA Wylie United U9 Boys</span>
                                </li>
                                <li style={{marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                    <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>→</span> 
                                    <span>Texas Horizon Academy (THA) Eagles U14 Boys</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <ul className="stats-grid">
                        <li>
                            <h3 className="text-primary">USSF D</h3>
                            <span>Licensed</span>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default About;
