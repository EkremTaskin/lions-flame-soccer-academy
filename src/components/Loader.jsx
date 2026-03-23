import React from 'react';
import './Loader.css';

const Loader = ({ fullScreen = false, size = 'default' }) => {
    return (
        <div className={`loader-container ${fullScreen ? 'full-screen' : ''} ${size === 'small' ? 'small' : ''}`}>
            <div className="spinner"></div>
        </div>
    );
};

export default Loader;
