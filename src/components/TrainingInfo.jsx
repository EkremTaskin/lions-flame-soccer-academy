import React from 'react';
import { Link } from 'react-router-dom';
import './TrainingInfo.css';

const infoCards = [
    {
        title: 'Training Location',
        body: 'Sessions are scheduled around the Wylie, TX area. Exact field details are confirmed after booking so families know where to arrive and park.',
    },
    {
        title: 'Age Range',
        body: 'Built for youth players ages 6-14, with groups organized by age, ability, and session type so every player gets the right level of challenge.',
    },
    {
        title: 'What To Bring',
        body: 'Players should bring cleats, shin guards, a full water bottle, weather-appropriate athletic clothing, and a positive training attitude.',
    },
    {
        title: 'First Session',
        body: 'New players begin with a focused evaluation of ball control, movement, confidence, and goals. Parents receive clear next-step guidance.',
    },
];

const TrainingInfo = () => {
    return (
        <section className="training-info-section">
            <div className="container training-info-container">
                <div className="training-info-intro">
                    <p className="section-kicker">Parent Guide</p>
                    <h2 className="section-title">Clear expectations before your player steps on the field.</h2>
                    <p>
                        We keep the process simple for families: choose the right session, confirm the details,
                        and arrive ready for purposeful, age-appropriate soccer development.
                    </p>
                    <Link to="/book" className="btn-primary">Schedule A Session</Link>
                </div>
                <div className="training-info-grid">
                    {infoCards.map((card) => (
                        <article className="training-info-card" key={card.title}>
                            <h3>{card.title}</h3>
                            <p>{card.body}</p>
                        </article>
                    ))}
                </div>
                <div className="policy-note">
                    <strong>Cancellation policy:</strong> If plans change, contact us as early as possible.
                    Weather-related changes are rescheduled for safety, and missed sessions are reviewed case by case.
                </div>
            </div>
        </section>
    );
};

export default TrainingInfo;
