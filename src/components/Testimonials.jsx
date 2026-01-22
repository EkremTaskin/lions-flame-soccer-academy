import React from 'react';
import './Testimonials.css';

const testimonialsData = [
    {
        id: 1,
        name: "Sarah Jenkins",
        role: "Parent",
        content: "The level of professionalism at Lion's Flame is unmatched. My son's technical skills have improved more in 3 months than in 2 years at his previous club.",
        rating: 5
    },
    {
        id: 2,
        name: "David Miller",
        role: "U14 Player",
        content: "The one-on-one sessions helped me fix my shooting technique. The coaches actually listen to your goals and push you to reach them.",
        rating: 5
    },
    {
        id: 3,
        name: "Robert Chen",
        role: "Parent",
        content: "The small group sessions are great. Very intense but the kids have a lot of fun. Coach Marcus really knows how to motivate them.",
        rating: 5
    }
];

const Testimonials = () => {
    return (
        <section id="testimonials" className="testimonials-section">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Success <span className="text-primary">Stories</span></h2>
                    <p className="section-subtitle">What parents and players say about their experience.</p>
                </div>

                <div className="testimonials-grid">
                    {testimonialsData.map((t, index) => (
                        <div key={t.id} className={`testimonial-card reveal delay-${index + 1}`}>
                            <div className="stars">
                                {[...Array(t.rating)].map((_, i) => (
                                    <span key={i}>★</span>
                                ))}
                            </div>
                            <p className="testimonial-content">"{t.content}"</p>
                            <div className="testimonial-author">
                                <h4>{t.name}</h4>
                                <span>{t.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
