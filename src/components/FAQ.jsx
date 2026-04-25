import React, { useState } from 'react';
import './FAQ.css';

const faqData = [
    {
        question: "What should my child bring to the training sessions?",
        answer: "Every player should come prepared with football boots (proper cleats), shin guards, a personalized water bottle, and appropriate athletic clothing. We provide all necessary training equipment like balls and cones."
    },
    {
        question: "What age groups do you cater to?",
        answer: "Our core academy training is designed for players ages 6 to 14. Sessions are adjusted by age, ability, and confidence level so each player receives an appropriate challenge."
    },
    {
        question: "Where do training sessions take place?",
        answer: "Sessions are scheduled around the Wylie, TX area. Exact field details are confirmed after booking so families have the latest arrival and parking information."
    },
    {
        question: "How does the first session work?",
        answer: "The first session includes a player evaluation, technical work, and a short parent summary. We use it to understand the player's goals and recommend the best training path."
    },
    {
        question: "What happens in case of bad weather?",
        answer: "Safety is our priority. In case of heavy rain or lightning, sessions may be postponed or moved to an indoor facility if available. We notify all parents via our WhatsApp group and email at least 1 hour before the session starts."
    },
    {
        question: "Can I watch the training sessions?",
        answer: "Yes, parents are welcome to watch from the designated spectator areas. However, we kindly ask that parents refrain from coaching from the sidelines to allow the players to stay focused on their trainers' instructions."
    },
    {
        question: "Do you offer sibling discounts?",
        answer: "Absolutely! We offer a 15% discount for the second child and 20% for any additional siblings enrolled in the same term. Please contact us directly to apply this to your booking."
    },
    {
        question: "What is the cancellation policy?",
        answer: "Please contact us as early as possible if you need to cancel or reschedule. Weather-related changes are rescheduled for safety, and missed sessions are reviewed case by case."
    }
];

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="faq" className="faq-section reveal">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Frequently Asked <span className="text-primary">Questions</span></h2>
                    <p className="section-subtitle">Everything you need to know about the Lion's Flame Academy.</p>
                </div>

                <div className="faq-container">
                    {faqData.map((item, index) => (
                        <div
                            key={index}
                            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => toggleFAQ(index)}
                        >
                            <div className="faq-question">
                                <h3>{item.question}</h3>
                                <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
                            </div>
                            <div className="faq-answer">
                                <p>{item.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
