import React, { useEffect, useState } from 'react';
import { getGIFStatus, downloadGIFs } from '../api';

const DownloadGIFs = ({ gifTaskId, videoId }) => {
    const [status, setStatus] = useState('');
    const [queuePosition, setQueuePosition] = useState(null);
    const [taskStatus, setTaskStatus] = useState('');

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await getGIFStatus(gifTaskId);
                setStatus(response.data.status);
                setQueuePosition(response.data.queue_position);
                setTaskStatus(response.data.task_status);
                if (response.data.status === 'complete') {
                    const blob = await downloadGIFs(videoId);
                    const url = window.URL.createObjectURL(new Blob([blob.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${videoId}.zip`);
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode.removeChild(link);
                }
            } catch (error) {
                console.error('Failed to get GIF status', error);
            }
        };

        const intervalId = setInterval(checkStatus, 5000);

        return () => clearInterval(intervalId);
    }, [gifTaskId, videoId]);

    return (
        <div>
            <h3>GIF Generation Status</h3>
            <p>Status: {status}</p>
            {queuePosition !== null && <p>Queue Position: {queuePosition}</p>}
            <p>Task Status: {taskStatus}</p>
        </div>
    );
};

export default DownloadGIFs;
