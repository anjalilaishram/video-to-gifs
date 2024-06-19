import React, { useState, useEffect, useRef } from 'react';
import { generateGIFs } from '../api';
import LoadingSpinner from './LoadingSpinner';

const GenerateGIFs = ({ videoId, segments, template, setGifTaskId, onComplete }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [queuePosition, setQueuePosition] = useState(null);
    const calledRef = useRef(false);

    useEffect(() => {
        const handleGenerateGIFs = async () => {
            try {
                const response = await generateGIFs({ video_id: videoId, segments_list: segments, template });
                setGifTaskId(response.data.task_id);
                localStorage.setItem('gif_task_id', response.data.task_id);
                setQueuePosition(response.data.queue_position);
                setLoading(false);
                onComplete();
            } catch (error) {
                setError('Failed to generate GIFs');
                setLoading(false);
            }
        };

        if (!calledRef.current) {
            handleGenerateGIFs();
            calledRef.current = true;
        }
    }, [videoId, segments, template, setGifTaskId, onComplete]);

    return (
        <div className="generate-gifs">
            {loading ? (
                <div>
                    <p><LoadingSpinner small /> Generating GIFs...</p>
                    <p>Queue Position: {queuePosition}</p>
                </div>
            ) : (
                <>
                    {error && <p className="error">{error}</p>}
                </>
            )}
        </div>
    );
};

export default GenerateGIFs;
