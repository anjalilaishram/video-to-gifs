import React, { useState } from 'react';
import UploadForm from './components/UploadForm';
import VideoInfo from './components/VideoInfo';
import SegmentsDisplay from './components/SegmentsDisplay';
import GenerateGIFs from './components/GenerateGIFs';
import DownloadGIFs from './components/DownloadGIFs';
import './App.css';

function App() {
    const [videoId, setVideoId] = useState(localStorage.getItem('video_id') || null);
    const [videoTaskId, setVideoTaskId] = useState(localStorage.getItem('video_task_id') || null);
    const [gifTaskId, setGifTaskId] = useState(localStorage.getItem('gif_task_id') || null);
    const [textSegments, setTextSegments] = useState([]);
    const [generatingGIFs, setGeneratingGIFs] = useState(false);
    const [fileName, setFileName] = useState(localStorage.getItem('file_name') || '');

    const template = {
        font_color: "yellow",
        font_size: 30,
        position: "bottom",
        max_words: 3,
        fps: 10
    };

    const reset = () => {
        setVideoId(null);
        setVideoTaskId(null);
        setGifTaskId(null);
        setTextSegments([]);
        setGeneratingGIFs(false);
        setFileName('');
        localStorage.removeItem('video_id');
        localStorage.removeItem('video_task_id');
        localStorage.removeItem('gif_task_id');
        localStorage.removeItem('file_name');
    };

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
                    onGenerateGIFs={() => setGeneratingGIFs(true)}
                    showGenerateButton={!gifTaskId && !generatingGIFs}
                />
            )}
            {generatingGIFs && (
                <GenerateGIFs
                    videoId={videoId}
                    segments={textSegments}
                    template={template}
                    setGifTaskId={setGifTaskId}
                    onComplete={() => setGeneratingGIFs(false)}
                />
            )}
            {gifTaskId && (
                <DownloadGIFs
                    gifTaskId={gifTaskId}
                    videoId={videoId}
                    reset={reset}
                />
            )}
        </div>
    );
}

export default App;
