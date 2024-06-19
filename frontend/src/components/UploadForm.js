import React, { useState } from 'react';
import { uploadVideo } from '../api';
import './UploadForm.css';  // Import the new CSS file

const UploadForm = ({ setVideoId, setVideoTaskId, setFileName }) => {
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
            setFileName(file.name);
            localStorage.setItem('video_id', response.data.video_id);
            localStorage.setItem('video_task_id', response.data.task_id);
            localStorage.setItem('file_name', file.name);
        } catch (error) {
            setError('Failed to upload video');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-form">
            <form onSubmit={handleSubmit}>
                <label htmlFor="file-upload" className="custom-file-upload">
                    {file ? file.name : 'Choose File'}
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="file-input"
                />
                <button type="submit" disabled={uploading} className="upload-button">
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default UploadForm;
