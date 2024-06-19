import React, { useEffect, useState } from 'react';
import { getVideoStatus, getProcessedText } from '../api';
import LoadingSpinner from './LoadingSpinner';

const VideoInfo = ({ videoTaskId, videoId, fileName, setTextSegments }) => {
    const [queuePosition, setQueuePosition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [segments, setSegments] = useState([]); // Local state for segments

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await getVideoStatus(videoTaskId);
                setQueuePosition(response.data.queue_position);
                if (response.data.status === 'processed') {
                    const fetchedSegments = await fetchTextSegments(response.data.video_id);
                    setSegments(fetchedSegments); // Update local segments state
                    setTextSegments(fetchedSegments); // Update parent state
                    setLoading(false);
                    clearInterval(intervalId);
                }
            } catch (error) {
                console.error('Failed to get video status', error);
            }
        };

        const intervalId = setInterval(checkStatus, 5000);
        checkStatus(); // Immediate call to show the first status

        return () => clearInterval(intervalId);
    }, [videoTaskId, setTextSegments, videoId]);

    const fetchTextSegments = async (videoId) => {
        const response = await getProcessedText(videoId);
        return response.data.text_segments || [];
    };

    return (
        <div className="video-info">
            <h3>Video: {fileName}</h3>
            {loading ? (
                <div>
                    <p><LoadingSpinner small /> Getting text segments...</p>
                    <p>Queue Position: {queuePosition}</p>
                </div>
            ) : (
                <div>
                    {queuePosition && <p>Queue Position: {queuePosition}</p>}
                </div>
            )}
        </div>
    );
};

export default VideoInfo;
