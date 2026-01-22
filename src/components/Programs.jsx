import React from 'react';
import './Programs.css';
import imgOneOnOne from '../assets/private_training_img_1769098655307.png';
import imgSmallGroup from '../assets/small_group_img_1769098675408.png';
import imgLargeGroup from '../assets/large_group_img_1769098698452.png';

const programsData = [
    {
        title: "One-on-One",
        age: "Ages 7-18",
        image: imgOneOnOne,
        description: "Personalized elite training focused on specific technical weaknesses and rapid improvement. Maximum ball touches and expert attention.",
        level: "Personalized",
        features: ["Custom Drill Plans", "Technical Video Review", "Specific Goal Setting"]
    },
    {
        title: "Small Group",
        age: "Ages 7-18",
        image: imgSmallGroup,
        description: "High-intensity sessions with 4-6 players. Perfect balance between individualized attention and competitive pressure.",
        level: "Elite",
        features: ["Tactical Awareness", "Competitive Drills", "Position Specifics"]
    },
    {
        title: "Large Group",
        age: "Ages 7-18",
        image: imgLargeGroup,
        description: "Team-based environment focusing on game situations with 8-12 players. Great for building match-fitness and game IQ.",
        level: "Atmospheric",
        features: ["7v7 / 11v11 Tactics", "Game Scenarios", "Team Building"]
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
                                <img src={program.image} alt={program.title} />
                                <span className="program-level">{program.level}</span>
                            </div>
                            <div className="card-header">
                                <h3 className="program-title">{program.title}</h3>
                                <p className="program-age">{program.age}</p>
                            </div>
                            <div className="card-body">
                                <p>{program.description}</p>
                                <ul className="program-features">
                                    {program.features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                                <a href={`/book?program=${encodeURIComponent(program.title)}`} className="btn-program">Join Team</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Programs;
