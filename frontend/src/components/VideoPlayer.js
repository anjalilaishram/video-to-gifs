import React from 'react';
const API_BASE_URL = 'http://0.0.0.0:5000';

const VideoPlayer = ({ videoId }) => {
    const videoUrl = `${API_BASE_URL}/static/videos/${videoId}`;

    return (
        <video width="100%" controls>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    );
};

export default VideoPlayer;
