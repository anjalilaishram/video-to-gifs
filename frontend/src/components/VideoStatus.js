import React, { useEffect, useState } from 'react';
import { getVideoStatus, getProcessedText } from '../api';
import LoadingSpinner from './LoadingSpinner';

const VideoStatus = ({ videoTaskId, setTextSegments, setVideoId }) => {
    const [status, setStatus] = useState('loading');
    const [queuePosition, setQueuePosition] = useState(null);
    const [taskStatus, setTaskStatus] = useState('');

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await getVideoStatus(videoTaskId);
                setStatus(response.data.status);
                setQueuePosition(response.data.queue_position);
                setTaskStatus(response.data.task_status);
                if (response.data.status === 'processed') {
                    setTextSegments(await fetchTextSegments(response.data.video_id));
                    setVideoId(response.data.video_id);
                    clearInterval(intervalId);  // Stop polling once processed
                }
            } catch (error) {
                console.error('Failed to get video status', error);
                setStatus('error');
            }
        };

        const intervalId = setInterval(checkStatus, 5000);

        checkStatus();  // Immediate call to show the first status

        return () => clearInterval(intervalId);
    }, [videoTaskId, setTextSegments, setVideoId]);

    const fetchTextSegments = async (videoId) => {
        const response = await getProcessedText(videoId);
        return response.data.text_segments;
    };

    if (status === 'loading') {
        return <LoadingSpinner />;
    }

    return (
        <div className="status">
            <h3>Video Processing Status</h3>
            <p>Status: {status}</p>
            {queuePosition !== null && (
                <p className="queue-position">Queue Position: {queuePosition}</p>
            )}
            <p>Task Status: {taskStatus}</p>
        </div>
    );
};

export default VideoStatus;
