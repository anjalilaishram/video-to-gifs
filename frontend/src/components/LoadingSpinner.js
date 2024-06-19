import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ small }) => {
    return (
        <div className={`loading-spinner ${small ? 'small' : ''}`}>
            <div className="spinner"></div>
        </div>
    );
};

export default LoadingSpinner;
