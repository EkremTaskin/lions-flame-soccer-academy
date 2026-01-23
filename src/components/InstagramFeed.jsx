import React from 'react';
import './InstagramFeed.css';
import ig1 from '../assets/instagram/ig_1.png';
import ig2 from '../assets/instagram/ig_2.png';
import ig3 from '../assets/instagram/ig_3.png';
import ig4 from '../assets/instagram/ig_4.png';
import ig5 from '../assets/instagram/ig_5.png';
import ig6 from '../assets/instagram/ig_6.png';
import profilePic from '../assets/instagram/profile_pic.png';

const InstagramFeed = () => {
    const posts = [
        { id: 1, img: ig1, likes: '243', comments: '12' },
        { id: 2, img: ig2, likes: '512', comments: '45' },
        { id: 3, img: ig3, likes: '189', comments: '8' },
        { id: 4, img: ig4, likes: '320', comments: '21' },
        { id: 5, img: ig5, likes: '674', comments: '56' },
        { id: 6, img: ig6, likes: '432', comments: '34' },
    ];

    return (
        <section className="instagram-section">
            <div className="container">
                <div className="instagram-browser-mockup">
                    {/* Instagram Header Mockup */}
                    <div className="ig-mockup-header">
                        <div className="ig-profile-info">
                            <div className="ig-avatar-wrapper">
                                <img src={profilePic} alt="Lions Flame Avatar" className="ig-avatar" />
                            </div>
                            <div className="ig-user-details">
                                <div className="ig-username-row">
                                    <h3 className="ig-username">lionsflameacademy</h3>
                                    <span className="verified-badge">✔️</span>
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="ig-follow-btn">Follow</a>
                                </div>
                                <div className="ig-stats-row">
                                    <span><strong>128</strong> posts</span>
                                    <span><strong>12.4K</strong> followers</span>
                                    <span><strong>420</strong> following</span>
                                </div>
                                <div className="ig-bio">
                                    <p className="ig-name">Lions Flame Soccer Academy</p>
                                    <p>⚽ Professional Football Training</p>
                                    <p>🏆 Elite Development & Tactical Excellence</p>
                                    <a href="#" className="ig-link">linktr.ee/lionsflame</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Instagram Tabs */}
                    <div className="ig-tabs">
                        <span className="ig-tab active">POSTS</span>
                        <span className="ig-tab">REELS</span>
                        <span className="ig-tab">TAGGED</span>
                    </div>

                    {/* Instagram Grid */}
                    <div className="instagram-grid">
                        {posts.map((post) => (
                            <div key={post.id} className="instagram-item">
                                <img src={post.img} alt={`Lions Flame Instagram Post ${post.id}`} />
                                <div className="instagram-overlay">
                                    <div className="overlay-content">
                                        <span>❤️ {post.likes}</span>
                                        <span>💬 {post.comments}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InstagramFeed;
