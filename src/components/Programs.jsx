import React from 'react';
import { Link } from 'react-router-dom';
import './Programs.css';
import imgOneOnOne from '../assets/private_training_img_1769098655307.jfif';
import imgSmallGroup from '../assets/small_group_img_1769098675408.jpg';
import imgLargeGroup from '../assets/large_group_img_1769098698452.jpg';

const programsData = [
    {
        title: "One-on-One",
        age: "All Ages",
        image: imgOneOnOne,
        position: 'center 20%',
        description: "Personalized elite training focused on specific technical weaknesses and rapid improvement. Maximum ball touches and expert attention.",
        level: "Personalized",
        pricing: {
            min45: "$25",
            min90: "$45"
        },
        features: ["Custom Drill Plans", "Flexible Scheduling"]
    },
    {
        title: "Small Group",
        age: "4–6 Players",
        image: imgSmallGroup,
        position: 'center 25%',
        description: "High-intensity sessions with 4-6 players. Perfect balance between individualized attention and competitive pressure. *Groups merged (U7-U10, U11-U14) if needed.",
        level: "Elite",
        pricing: {
            min45: "$15",
            min90: "$25"
        },
        features: ["Tactical Awareness", "Competitive Drills", "Fixed Hour Sessions"]
    },
    {
        title: "Large Group",
        age: "8–12 Players",
        image: imgLargeGroup,
        description: "Team-based environment focusing on game situations with 8-12 players. Great for building match-fitness and game IQ. *Groups merged (U7-U10, U11-U14) if needed.",
        level: "Atmospheric",
        pricing: {
            min45: "$10",
            min90: "$20"
        },
        features: ["Game Scenarios", "Match Fitness", "Team Building"]
    }
];

const Programs = () => {
    return (
        <section id="programs" className="programs-section">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Our <span className="text-primary">Programs</span></h2>
                    <p className="section-subtitle">Specialized training pathways designed for rapid progression.</p>
                </div>

                <div className="programs-grid">
                    {programsData.map((program, index) => (
                        <div key={index} className={`program-card reveal delay-${index + 1}`}>
                            <div className="card-image">
                                <img 
                                    src={program.image} 
                                    alt={program.title} 
                                    style={program.position ? { objectPosition: program.position } : {}}
                                />
                                <span className="program-level">{program.level}</span>
                            </div>
                            <div className="card-header">
                                <h3 className="program-title">{program.title}</h3>
                                <p className="program-age">{program.age}</p>
                            </div>
                            <div className="card-body">
                                <p>{program.description}</p>
                                <div className="pricing-grid">
                                    <div className="price-item">
                                        <span className="price-label">45 Min</span>
                                        <span className="price-value text-primary">{program.pricing.min45}</span>
                                    </div>
                                    <div className="price-item">
                                        <span className="price-label">90 Min</span>
                                        <span className="price-value text-primary">{program.pricing.min90}</span>
                                    </div>
                                </div>
                                <ul className="program-features">
                                    {program.features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                                <Link to={`/book?program=${encodeURIComponent(program.title)}`} className="btn-program">BOOK</Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="packages-section">
                    <div className="packages-header text-center">
                        <h3 className="sub-section-title">Special <span className="text-primary">Promotion</span></h3>
                        <p>Unlock our exclusive limited-time lesson bundle for maximum value.</p>
                    </div>
                    <div className="packages-grid single-package">
                        <div className="package-card featured">
                            <div className="package-discount">2 FREE</div>
                            <h4>10-Lesson Bundle</h4>
                            <p className="package-validity">Pay for 8, Get 10 Sessions</p>
                            <ul className="package-benefits">
                                <li>Buy 8 lessons, get 2 extra for <strong>FREE</strong></li>
                                <li>Long-term development plan</li>
                                <li>Priority session selection</li>
                                <li>Flexible scheduling across 4 months</li>
                                <li>2 Makeup sessions included</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Programs;
