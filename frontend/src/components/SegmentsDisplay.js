import React from 'react';

const SegmentsDisplay = ({ segments, onGenerateGIFs }) => {
    return (
        <div>
            <h3>Text Segments</h3>
            {segments.map((segment, index) => (
                <div key={index}>
                    <p>{segment.text}</p>
                </div>
            ))}
            <button onClick={onGenerateGIFs}>Generate GIFs</button>
        </div>
    );
};

export default SegmentsDisplay;
