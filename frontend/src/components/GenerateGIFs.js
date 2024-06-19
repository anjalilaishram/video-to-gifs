import React, { useState } from 'react';
import { generateGIFs } from '../api';

const GenerateGIFs = ({ videoId, segments, template }) => {
    const [taskId, setTaskId] = useState(null);
    const [error, setError] = useState('');

    const handleGenerateGIFs = async () => {
        try {
            const response = await generateGIFs({ video_id: videoId, segments_list: segments, template });
            setTaskId(response.data.task_id);
            localStorage.setItem('gif_task_id', response.data.task_id);
        } catch (error) {
            setError('Failed to generate GIFs');
        }
    };

    return (
        <div>
            <button onClick={handleGenerateGIFs}>Generate GIFs</button>
            {taskId && <p>GIF Generation Task ID: {taskId}</p>}
            {error && <p>{error}</p>}
        </div>
    );
};

export default GenerateGIFs;
