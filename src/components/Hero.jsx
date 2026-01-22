import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import './Hero.css';

const Hero = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const buttonsRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Text Animations
        tl.fromTo(titleRef.current.children,
            { y: 100, opacity: 0, skewY: 7 },
            { y: 0, opacity: 1, skewY: 0, duration: 1, stagger: 0.2, delay: 0.5 }
        )
            .fromTo(subtitleRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8 },
                "-=0.5"
            )
            .fromTo(buttonsRef.current.children,
                { x: -20, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.6, stagger: 0.15 },
                "-=0.4"
            );
    }, []);

    return (
        <section id="home" className="hero">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="hero-video"
            >
                <source src={`${import.meta.env.BASE_URL}hero-video.mp4`} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="hero-overlay"></div>
            <div className="container hero-content">
                <h1 className="hero-title" ref={titleRef}>
                    <span>Train.</span>
                    <span className="text-stroke">Grow.</span>
                    <span className="text-primary">Succeed.</span>
                </h1>
                <p className="hero-subtitle" ref={subtitleRef}>
                    Professional football coaching for ages 6-18.
                    Ignite your passion and master the game at Lion's Flame Academy.
                </p>
                <div className="hero-buttons" ref={buttonsRef}>
                    <Link to="/book" className="btn-primary">Book a Trial</Link>
                    <a href="#programs" className="btn-outline">View Programs</a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
