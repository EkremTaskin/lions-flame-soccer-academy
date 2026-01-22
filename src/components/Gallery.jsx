import React, { useState } from 'react';
import './Gallery.css';

const galleryData = [
    { id: 1, src: 'gallery_1.png', alt: 'Intense Match Action', category: 'Match' },
    { id: 2, src: 'gallery_2.png', alt: 'Precision Drills', category: 'Training' },
    { id: 3, src: 'gallery_3.png', alt: 'Team Spirit', category: 'Team' },
    { id: 4, src: 'gallery_4.png', alt: 'Expert Coaching', category: 'Coaching' }
];

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <section id="gallery" className="gallery-section">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Academy <span className="text-primary">Gallery</span></h2>
                    <p className="section-subtitle">Moments of passion, dedication, and triumph.</p>
                </div>

                <div className="gallery-grid">
                    {galleryData.map((item, index) => (
                        <div key={item.id} className={`gallery-item reveal delay-${index + 1}`} onClick={() => setSelectedImage(item)}>
                            <div className="image-wrapper">
                                <img src={item.src} alt={item.alt} loading="lazy" />
                                <div className="image-overlay">
                                    <span className="category-tag">{item.category}</span>
                                    <h3>{item.alt}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div className="lightbox" onClick={() => setSelectedImage(null)}>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedImage.src} alt={selectedImage.alt} />
                        <div className="lightbox-caption">
                            <h3>{selectedImage.alt}</h3>
                            <p>{selectedImage.category}</p>
                        </div>
                        <button className="close-btn" onClick={() => setSelectedImage(null)}>&times;</button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Gallery;
