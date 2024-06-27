import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Box, Typography } from '@mui/material';
import { getGIFStatus, downloadGIFs } from '../api';

const DownloadGIFs = ({ gifTaskId, videoId, reset, setGifGenerated, gifGenerated, generateGifQueuePosition, setGenerateGifQueuePosition }) => {
    const [downloadable, setDownloadable] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await getGIFStatus(gifTaskId);
                setGenerateGifQueuePosition(response.data.queue_position);
                if (response.data.status === 'complete') {
                    setDownloadable(true);
                    setGifGenerated(true); // Mark GIFs as generated
                    clearInterval(intervalId); // Stop polling once complete
                }
            } catch (error) {
                console.error('Failed to get GIF status', error);
                setGifGenerated(false); // Mark GIFs as not generated
            }
        };

        const intervalId = setInterval(checkStatus, 5000);
        checkStatus(); // Immediate call to show the first status

        return () => clearInterval(intervalId);
    }, [gifTaskId, setGifGenerated]);

    const handleDownload = async () => {
        try {
            const blob = await downloadGIFs(videoId);
            const url = window.URL.createObjectURL(new Blob([blob.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${videoId}.zip`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Failed to download GIFs', error);
        }
    };

    return (
        <Box className="download-gifs" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            {gifGenerated ? (
                <>
                    <Button variant="contained" color="primary" onClick={handleDownload}>
                        Download GIFs
                    </Button>
                </>
            ) : (
                <Box textAlign="center">
                    <CircularProgress />
                    <Typography variant="body2" mt={2}>
                        {generateGifQueuePosition !== null ? `Queue Position: ${generateGifQueuePosition}` : 'Processing...'}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default DownloadGIFs;
