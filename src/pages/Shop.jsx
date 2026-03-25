import React from 'react';
import Navbar from '../components/Navbar';
import jerseyImg from '../assets/shop/jersey.png';
import capImg from '../assets/shop/cap.png';
import bottleImg from '../assets/shop/bottle.png';
import keychainImg from '../assets/shop/keychain.png';
import './Shop.css';

const products = [
    {
        id: 1,
        name: "Official Training Jersey",
        category: "Apparel",
        price: "$45.00",
        image: jerseyImg,
        description: "Breathable, performance-focused fabric with integrated Lion's Flame logo."
    },
    {
        id: 2,
        name: "Academy Elite Cap",
        category: "Accessories",
        price: "$25.00",
        image: capImg,
        description: "Adjustable athletic fit with premium embroidered academy branding."
    },
    {
        id: 3,
        name: "Insulated Water Bottle",
        category: "Equipment",
        price: "$30.00",
        image: bottleImg,
        description: "Triple-layered stainless steel to keep your hydration cold for 24 hours."
    },
    {
        id: 4,
        name: "Signature Keychain",
        category: "Accessories",
        price: "$12.00",
        image: keychainImg,
        description: "Durable metal and leather keychain featuring our iconic flame."
    }
];

const Shop = () => {
    return (
        <>
            <Navbar />
            <div className="shop-page">
                <header className="shop-header">
                    <div className="container">
                        <h1 className="text-secondary">Official <span className="text-primary">Academy Shop</span></h1>
                        <p>High-performance gear designed for the modern athlete.</p>
                    </div>
                </header>

                <div className="container pb-5">
                    <div className="shop-grid">
                        {products.map(product => (
                            <div key={product.id} className="product-card reveal">
                                <div className="product-image-container">
                                    <img src={product.image} alt={product.name} />
                                    <span className="product-badge">{product.category}</span>
                                </div>
                                <div className="product-details">
                                    <div className="product-info-top">
                                        <h3>{product.name}</h3>
                                        <span className="product-price">{product.price}</span>
                                    </div>
                                    <p>{product.description}</p>
                                    <button className="btn-primary full-width mt-3">Add to Cart</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="shop-info-section">
                    <div className="container">
                        <div className="info-grid">
                            <div className="info-item">
                                <div className="info-icon">🚚</div>
                                <h4>Global Shipping</h4>
                                <p>Worldwide delivery straight to your doorstep.</p>
                            </div>
                            <div className="info-item">
                                <div className="info-icon">💎</div>
                                <h4>Premium Quality</h4>
                                <p>Each item is made to order using top-tier materials.</p>
                            </div>
                            <div className="info-item">
                                <div className="info-icon">🔄</div>
                                <h4>Easy Returns</h4>
                                <p>30-day satisfaction guarantee on all merchandise.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Shop;
