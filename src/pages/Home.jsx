import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Programs from '../components/Programs';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import ParticleBackground from '../components/ParticleBackground';

import InstagramFeed from '../components/InstagramFeed';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const mainRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // -- GENERAL SECTION REVEALS --
            const sections = document.querySelectorAll('section, .instagram-section');
            sections.forEach(section => {
                gsap.fromTo(section,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 80%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            });

            // -- SPECIFIC STAGGER FOR CARDS --
            const cards = document.querySelectorAll('.program-card, .testimonial-card, .gallery-item, .instagram-item');
            gsap.fromTo(cards,
                { opacity: 0, scale: 0.9, y: 30 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: cards[0], // Trigger when the first card row is visible
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );

            // -- PARALLAX FOR HERO BACKGROUND (Simple but effective) --
            gsap.to(".hero", {
                backgroundPositionY: "50%",
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });

            // -- 3D CARD TILT EFFECT --
            const tiltCards = document.querySelectorAll('.program-card');
            tiltCards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / 25;
                    const rotateY = (centerX - x) / 25;

                    gsap.to(card, {
                        rotateY: rotateY,
                        transformPerspective: 1000,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        rotateX: 0,
                        rotateY: 0,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                });
            });

        }, mainRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={mainRef}>
            <ParticleBackground />
            <Navbar />
            <Hero />
            <About />
            <Programs />
            <Gallery />
            <Testimonials />
            <FAQ />
            <InstagramFeed />
            <Contact />
        </div>
    );
};

export default Home;
