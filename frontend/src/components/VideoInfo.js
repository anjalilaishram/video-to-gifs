import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { getVideoStatus, getProcessedText } from '../api';
import VideoPlayer from './VideoPlayer';
import SegmentsDisplay from './SegmentsDisplay';

const VideoInfo = ({ videoTaskId, videoId, fileName, setTextSegments, reset }) => {
    const [queuePosition, setQueuePosition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [segments, setSegments] = useState([]);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await getVideoStatus(videoTaskId);
                setQueuePosition(response.data.queue_position);
                if (response.data.status === 'processed') {
                    const fetchedSegments = await fetchTextSegments(response.data.video_id);
                    setSegments(fetchedSegments);
                    setTextSegments(fetchedSegments);
                    setLoading(false);
                    clearInterval(intervalId);
                }
            } catch (error) {
                console.error('Failed to get video status', error);
            }
        };

        const intervalId = setInterval(checkStatus, 5000);
        checkStatus();

        return () => clearInterval(intervalId);
    }, [videoTaskId, setTextSegments, videoId]);

    const fetchTextSegments = async (videoId) => {
        const response = await getProcessedText(videoId);
        return response.data.text_segments || [];
    };

    return (
        <Box>
            <Box display="flex"  alignItems="center" sx={{ mt: 4 }} marginBlockEnd={2}>
                <Typography variant="h6" gutterBottom>
                    {fileName}
                </Typography>
                <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={reset} 
                    sx={{ ml: 2 }}  // Adjust margin between items
                >
                    Upload New Video
                </Button>
            </Box>

            {loading ? (
                <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
                    <CircularProgress size={24} />
                    <Typography mt={1}>Getting text segments...</Typography>
                    {queuePosition !== null && (
                        <Typography mt={1}>Queue Position: {queuePosition}</Typography>
                    )}
                </Box>
            ) : (
                <Box>
                    <VideoPlayer videoId={videoId} />
                    {queuePosition !== null && (
                        <Typography mt={1}>Queue Position: {queuePosition}</Typography>
                    )}
                    <SegmentsDisplay segments={segments} />
                </Box>
            )}
        </Box>
    );
};

export default VideoInfo;
