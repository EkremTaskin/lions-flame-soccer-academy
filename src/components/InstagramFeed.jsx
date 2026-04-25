import React from 'react';
import './InstagramFeed.css';
import profilePic from '../assets/instagram/ig_profile.jpg';

const InstagramFeed = () => {
    const posts = [
        { id: 1, img: 'gallery/optimized/DJI_20260401195911_0756_D.jpg', likes: '154', comments: '8' },
        { id: 2, img: 'gallery/optimized/DJI_20260401200216_0779_D.jpg', likes: '210', comments: '12' },
        { id: 3, img: 'gallery/optimized/DJI_20260401200659_0811_D.jpg', likes: '189', comments: '5' },
        { id: 4, img: 'gallery/optimized/DJI_20260401201624_0855_D.jpg', likes: '320', comments: '21' },
        { id: 5, img: 'gallery/optimized/IMG_0733.jpg', likes: '145', comments: '9' },
        { id: 6, img: 'gallery/optimized/IMG_0749.jpg', likes: '232', comments: '14' },
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
                                    <h3 className="ig-username">lionsflamesocceracademy</h3>
                                    <span className="verified-badge">✔️</span>
                                    <a href="https://www.instagram.com/lionsflamesocceracademy/" target="_blank" rel="noopener noreferrer" className="ig-follow-btn">Follow</a>
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
                                <img src={post.img} alt={`Lions Flame Instagram Post ${post.id}`} loading="lazy" />
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
