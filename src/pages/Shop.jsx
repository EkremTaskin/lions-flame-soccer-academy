import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import bannerImg from '../assets/shop/banner.png';
import './Shop.css';

const Shop = () => {
    return (
        <div className="shop-layout shop-coming-soon-layout">
            <Navbar />
            <main className="shop-coming-soon">
                <div className="shop-coming-media">
                    <img src={bannerImg} alt="Lions Flame academy gear preview" loading="eager" />
                </div>
                <div className="shop-coming-content">
                    <p className="shop-eyebrow">Academy Shop</p>
                    <h1>Coming Soon</h1>
                    <p>
                        Lions Flame training gear and academy merchandise are being prepared.
                        For now, all online store purchases are paused.
                    </p>
                    <div className="shop-coming-actions">
                        <Link to="/#programs" className="btn-primary">View Programs</Link>
                        <Link to="/#contact" className="btn-outline-dark">Contact Us</Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Shop;
