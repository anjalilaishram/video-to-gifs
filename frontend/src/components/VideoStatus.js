import React, { useEffect, useState } from 'react';
import { getVideoStatus, getProcessedText } from '../api';

const VideoStatus = ({ videoTaskId, setTextSegments, setVideoId }) => {
    const [status, setStatus] = useState('');
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
                }
            } catch (error) {
                console.error('Failed to get video status', error);
            }
        };

        const intervalId = setInterval(checkStatus, 5000);

        return () => clearInterval(intervalId);
    }, [videoTaskId, setTextSegments, setVideoId]);

    const fetchTextSegments = async (videoId) => {
        const response = await getProcessedText(videoId);
        return response.data.text_segments;
    };

    return (
        <div>
            <h3>Video Processing Status</h3>
            <p>Status: {status}</p>
            {queuePosition !== null && <p>Queue Position: {queuePosition}</p>}
            <p>Task Status: {taskStatus}</p>
        </div>
    );
};

export default VideoStatus;
