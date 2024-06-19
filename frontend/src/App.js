import React, { useState } from 'react';
import UploadForm from './components/UploadForm';
import VideoStatus from './components/VideoStatus';
import SegmentsDisplay from './components/SegmentsDisplay';
import GenerateGIFs from './components/GenerateGIFs';
import DownloadGIFs from './components/DownloadGIFs';

function App() {
    const [videoId, setVideoId] = useState(localStorage.getItem('video_id') || null);
    const [videoTaskId, setVideoTaskId] = useState(localStorage.getItem('video_task_id') || null);
    const [gifTaskId, setGifTaskId] = useState(localStorage.getItem('gif_task_id') || null);
    const [textSegments, setTextSegments] = useState([]);

    const template = {
        font_color: "yellow",
        font_size: 30,
        position: "bottom",
        max_words: 3,
        fps: 10
    };

    return (
        <div className="App">
            {!videoId && <UploadForm setVideoId={setVideoId} setVideoTaskId={setVideoTaskId} />}
            {videoTaskId && !textSegments.length && (
                <VideoStatus
                    videoTaskId={videoTaskId}
                    setTextSegments={setTextSegments}
                    setVideoId={setVideoId}
                />
            )}
            {textSegments.length > 0 && (
                <SegmentsDisplay
                    segments={textSegments}
                    onGenerateGIFs={() => setGifTaskId('start')}
                />
            )}
            {gifTaskId === 'start' && (
                <GenerateGIFs
                    videoId={videoId}
                    segments={textSegments}
                    template={template}
                    setGifTaskId={setGifTaskId}
                />
            )}
            {gifTaskId && gifTaskId !== 'start' && (
                <DownloadGIFs gifTaskId={gifTaskId} videoId={videoId} />
            )}
        </div>
    );
}

export default App;
