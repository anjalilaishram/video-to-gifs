import React, { useState } from 'react';
import './GIFDisplay.css';

const GIFDisplay = ({ gifURLs }) => {
    const [selectedGIF, setSelectedGIF] = useState(null);

    const handleGIFClick = (url) => {
        setSelectedGIF(url);
    };

    const closeModal = () => {
        setSelectedGIF(null);
    };

    return (
        <div className="gif-display">
            <h3>Generated GIFs</h3>
            <div className="gifs">
                {gifURLs.map((url, index) => (
                    <div key={index} className="gif-item" onClick={() => handleGIFClick(url)}>
                        <img src={url} alt={`GIF ${index}`} />
                    </div>
                ))}
            </div>

            {selectedGIF && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>&times;</span>
                        <img src={selectedGIF} alt="Selected GIF" className="modal-image" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default GIFDisplay;
