import React, { useState } from 'react';
import './Gallery.css';

const galleryData = [
    { id: 1, src: 'gallery/optimized/DJI_20260401195911_0756_D.jpg', alt: 'Academy Selection 1', category: 'Academy' },
    { id: 2, src: 'gallery/optimized/DJI_20260401200216_0779_D.jpg', alt: 'Academy Selection 2', category: 'Academy' },
    { id: 3, src: 'gallery/optimized/DJI_20260401200659_0811_D.jpg', alt: 'Academy Selection 3', category: 'Academy' },
    { id: 4, src: 'gallery/optimized/DJI_20260401201624_0855_D.jpg', alt: 'Academy Selection 4', category: 'Academy' },
    { id: 5, src: 'gallery/optimized/IMG_0733.jpg', alt: 'Academy Selection 5', category: 'Academy' },
    { id: 6, src: 'gallery/optimized/IMG_0749.jpg', alt: 'Academy Selection 6', category: 'Academy' },
    { id: 7, src: 'gallery/optimized/IMG_0782.jpg', alt: 'Academy Selection 7', category: 'Academy' },
]
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
                                <img
                                    src={item.src}
                                    alt={item.alt}
                                    loading="lazy"
                                    style={item.position ? { objectPosition: item.position } : {}}
                                />
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
