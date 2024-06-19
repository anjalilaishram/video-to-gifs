import React from 'react';

const SegmentsDisplay = ({ segments, onGenerateGIFs, showGenerateButton }) => {
    return (
        <div className="segments-display">
            <h3>Text Segments</h3>
            <div className="segments">
                {segments.map((segment, index) => (
                    <span key={index} className="segment">
                        {segment.text}
                    </span>
                ))}
            </div>
            {showGenerateButton && (
                <button onClick={onGenerateGIFs}>Generate GIFs</button>
            )}
        </div>
    );
};

export default SegmentsDisplay;
