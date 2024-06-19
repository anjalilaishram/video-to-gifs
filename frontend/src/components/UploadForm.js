import React, { useState } from 'react';
import { uploadVideo } from '../api';

const UploadForm = ({ setVideoId, setVideoTaskId }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) return;

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await uploadVideo(formData);
            setVideoId(response.data.video_id);
            setVideoTaskId(response.data.task_id);
            localStorage.setItem('video_id', response.data.video_id);
            localStorage.setItem('video_task_id', response.data.task_id);
        } catch (error) {
            setError('Failed to upload video');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="video/*" onChange={handleFileChange} />
                <button type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default UploadForm;
