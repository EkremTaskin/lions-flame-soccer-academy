import React from 'react';
import './About.css';

const About = () => {
    return (
        <section id="about" className="about-section">
            <div className="container about-container">
                <div className="about-image-wrapper">
                    <img src="/coach-img.png" alt="Head Coach Marcus Sterling" className="about-image" />
                </div>
                <div className="about-text">
                    <h2 className="section-title">Meet Our <span className="text-primary">Head Coach</span></h2>
                    <p>
                        Lion's Flame Academy is led by a dedicated professional committed to technical excellence and player growth.
                    </p>
                    <div className="coach-info">
                        <h3>Coach Marcus Sterling</h3>
                        <p className="coach-title">Head of Player Development</p>
                        <p className="coach-bio">
                            With over 15 years of experience in youth elite training, Coach Marcus focuses on building high-performance mindsets and tactical discipline. His approach combines professional rigor with a passion for mentoring the next generation of football stars.
                        </p>
                    </div>
                    <ul className="stats-grid">
                        <li>
                            <h3 className="text-primary">UEFA A</h3>
                            <span>Licensed</span>
                        </li>
                        <li>
                            <h3 className="text-primary">15+</h3>
                            <span>Years Exp</span>
                        </li>
                        <li>
                            <h3 className="text-primary">Pro</h3>
                            <span>Background</span>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default About;
