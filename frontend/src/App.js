import React, { useState, useEffect } from 'react';
import UploadForm from './components/UploadForm';
import VideoInfo from './components/VideoInfo';
import SegmentsDisplay from './components/SegmentsDisplay';
import GenerateGIFs from './components/GenerateGIFs';
import DownloadGIFs from './components/DownloadGIFs';
import GIFDisplay from './components/GIFDisplay';
import { getGIFURLs } from './api';
import './App.css';

function App() {
    const [videoId, setVideoId] = useState(localStorage.getItem('video_id') || null);
    const [videoTaskId, setVideoTaskId] = useState(localStorage.getItem('video_task_id') || null);
    const [gifTaskId, setGifTaskId] = useState(localStorage.getItem('gif_task_id') || null);
    const [textSegments, setTextSegments] = useState([]);
    const [gifURLs, setGifURLs] = useState([]);  // State for GIF URLs
    const [generatingGIFs, setGeneratingGIFs] = useState(false);
    const [fileName, setFileName] = useState(localStorage.getItem('file_name') || '');
    const [gifGenerated, setGifGenerated] = useState(false); // New state to track GIF generation
    const [generateGifQueuePosition, setGenerateGifQueuePosition] = useState(null);

    const template = {
        "font_color": "yellow",
        "font_size": 144,
        "position": "bottom",
        "bold": true,
        "background_color": "#000000",
        "background_opacity": 0.5,
        "padding": 34,
        "margin": 8,
        "max_words": 3,
        "fps": 10
    };

    const reset = () => {
        setVideoId(null);
        setVideoTaskId(null);
        setGifTaskId(null);
        setTextSegments([]);
        setGifURLs([]);  // Reset GIF URLs
        setGeneratingGIFs(true);
        setGifGenerated(false);
        setFileName('');
        localStorage.removeItem('video_id');
        localStorage.removeItem('video_task_id');
        localStorage.removeItem('gif_task_id');
        localStorage.removeItem('file_name');
    };

    useEffect(() => {
        const fetchGIFs = async () => {
            if (videoId && gifGenerated) {
                try {
                    const data = await getGIFURLs(videoId);
                    setGifURLs(data.gif_urls);
                } catch (error) {
                    console.error('Failed to fetch GIF URLs', error);
                }
            }
        };

        fetchGIFs();
    }, [gifGenerated, videoId]);

    return (
        <div className="App">
            <h1>Video to GIFs</h1>
            {!videoId && (
                <UploadForm
                    setVideoId={setVideoId}
                    setVideoTaskId={setVideoTaskId}
                    setFileName={setFileName}
                />
            )}
            {videoId && (
                <VideoInfo
                    videoTaskId={videoTaskId}
                    videoId={videoId}
                    fileName={fileName}
                    setTextSegments={setTextSegments}
                />
            )}
            {textSegments.length > 0 && (
                <SegmentsDisplay
                    segments={textSegments}
                />
            )}
            {(
                <GenerateGIFs
                    videoId={videoId}
                    segments={textSegments}
                    template={template}
                    setGifGenerated={setGifGenerated}
                    gifGenerated={gifGenerated}
                    setGifTaskId={setGifTaskId}
                    generateGifQueuePosition={generateGifQueuePosition}
                    setGenerateGifQueuePosition={setGenerateGifQueuePosition}
                />
            )}
            {gifTaskId && (
                <DownloadGIFs
                    gifTaskId={gifTaskId}
                    videoId={videoId}
                    reset={reset}
                    setGifGenerated={setGifGenerated}
                    gifGenerated={gifGenerated}
                    generateGifQueuePosition={generateGifQueuePosition}
                    setGenerateGifQueuePosition={setGenerateGifQueuePosition}
                />
            )}
            {gifGenerated && gifURLs.length > 0 && (
                <GIFDisplay gifURLs={gifURLs} />
            )}
        </div>
    );
}

export default App;
