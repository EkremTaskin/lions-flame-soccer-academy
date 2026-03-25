import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { productsData } from '../data/shopStore';
import './ProductDetail.css';

const ProductDetail = () => {
    const { productId } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("white");
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const foundProduct = productsData.find(p => p.id === parseInt(productId));
        setProduct(foundProduct);
        // Scroll to top when product changes
        window.scrollTo(0, 0);
    }, [productId]);

    if (!product) return <div className="product-loading">Loading product...</div>;

    const incrementQty = () => setQuantity(prev => prev + 1);
    const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="product-detail-layout">
            <Navbar />
            
            <div className="container product-container">
                <header className="pd-header">
                    <nav className="breadcrumb">
                        <Link to="/">Home</Link> / <Link to="/shop">All Products</Link> / <span>{product.name}</span>
                    </nav>
                    <div className="pd-nav">
                        <span className="nav-item">‹ Prev</span>
                        <span className="nav-divider">|</span>
                        <span className="nav-item">Next ›</span>
                    </div>
                </header>

                <div className="pd-grid">
                    {/* Left: Images */}
                    <div className="pd-gallery">
                        <div className="pd-main-img">
                            <img src={product.image} alt={product.name} />
                        </div>
                        <div className="pd-thumbnails">
                            <div className="pd-thumb active"><img src={product.image} alt="thumbnail" /></div>
                            <div className="pd-thumb"><img src={product.image} alt="thumbnail" /></div>
                            <div className="pd-thumb video-thumb">
                                <span className="play-icon">▶</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="pd-info">
                        <h1 className="pd-title">{product.name}</h1>
                        <div className="pd-prices">
                            <span className="p-original">${product.originalPrice.toFixed(2)}</span>
                            <span className="p-current">${product.price.toFixed(2)}</span>
                        </div>

                        <div className="pd-options">
                            <div className="opt-group">
                                <label>Color *</label>
                                <div className="color-swatches">
                                    <button 
                                        className={`swatch white ${selectedColor === 'white' ? 'active' : ''}`}
                                        onClick={() => setSelectedColor('white')}
                                    ></button>
                                    <button 
                                        className={`swatch red ${selectedColor === 'red' ? 'active' : ''}`}
                                        onClick={() => setSelectedColor('red')}
                                    ></button>
                                </div>
                            </div>

                            <div className="opt-group">
                                <label>Size *</label>
                                <select 
                                    value={selectedSize} 
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                    className="pd-select"
                                >
                                    <option value="">Select</option>
                                    <option value="S">Small</option>
                                    <option value="M">Medium</option>
                                    <option value="L">Large</option>
                                    <option value="XL">Extra Large</option>
                                </select>
                            </div>

                            <div className="opt-group">
                                <label>Quantity *</label>
                                <div className="qty-picker">
                                    <button onClick={decrementQty}>−</button>
                                    <span>{quantity}</span>
                                    <button onClick={incrementQty}>+</button>
                                </div>
                            </div>
                        </div>

                        <button className="btn-add-cart">Add to Cart</button>

                        <div className="pd-socials">
                            <span><i className="social-icon">f</i></span>
                            <span><i className="social-icon">📍</i></span>
                            <span><i className="social-icon">💬</i></span>
                            <span><i className="social-icon">𝕏</i></span>
                        </div>
                    </div>
                </div>

                {/* Footer: Detailed Description */}
                <div className="pd-description">
                    <p className="pd-desc-intro">{product.description}</p>
                    <ul className="pd-details-list">
                        {product.details.map((detail, idx) => (
                            <li key={idx}>• {detail}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
