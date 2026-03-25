import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import jerseyImg from '../assets/shop/jersey.png';
import capImg from '../assets/shop/cap.png';
import bottleImg from '../assets/shop/bottle.png';
import keychainImg from '../assets/shop/keychain.png';
import bannerImg from '../assets/shop/banner.png';
import { productsData } from '../data/shopStore';
import './Shop.css';

const Shop = () => {
    const [priceRange, setPriceRange] = useState(45);

    return (
        <div className="shop-layout">
            <Navbar />
            
            <div className="shop-container">
                <nav className="breadcrumb">
                    <Link to="/">Home</Link> &gt; <span>All Products</span>
                </nav>

                <div className="shop-content-wrapper">
                    {/* Sidebar */}
                    <aside className="shop-sidebar">
                        <div className="sidebar-section">
                            <h3>Browse by</h3>
                            <ul className="filter-list">
                                <li className="active">All Products</li>
                            </ul>
                        </div>

                        <div className="sidebar-section">
                            <h3>Filter by</h3>
                            <div className="filter-group">
                                <div className="filter-header">
                                    <span>Price</span>
                                    <span>−</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="12" 
                                    max="45" 
                                    value={priceRange} 
                                    onChange={(e) => setPriceRange(e.target.value)}
                                    className="price-slider"
                                />
                                <div className="price-labels">
                                    <span>$12</span>
                                    <span>${priceRange}</span>
                                </div>
                            </div>

                            <div className="filter-group accordion">
                                <div className="filter-header">
                                    <span>Color</span>
                                    <span>+</span>
                                </div>
                            </div>

                            <div className="filter-group accordion">
                                <div className="filter-header">
                                    <span>Size</span>
                                    <span>+</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="shop-main">
                        <div className="shop-banner">
                            <img src={bannerImg} alt="Academy Training" />
                        </div>

                        <div className="shop-results-header">
                            <h2>All Products</h2>
                            <div className="sort-wrapper">
                                <span>{productsData.length} products</span>
                                <div className="sort-select">
                                    Sort by: <strong>Recommended</strong> ▾
                                </div>
                            </div>
                        </div>

                        <div className="shop-product-grid">
                            {productsData.map(product => (
                                <Link key={product.id} to={`/shop/${product.id}`} className="shop-product-card">
                                    <div className="product-img-box">
                                        {product.badge && <span className="p-badge">{product.badge}</span>}
                                        <img src={product.image} alt={product.name} />
                                    </div>
                                    <div className="product-info-box">
                                        <h4>{product.name}</h4>
                                        <div className="p-prices">
                                            <span className="p-original">${product.originalPrice.toFixed(2)}</span>
                                            <span className="p-current">${product.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Shop;
