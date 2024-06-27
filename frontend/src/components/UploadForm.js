import React, { useState } from 'react';
import { uploadVideo } from '../api';
import {
    Box,
    Button,
    CircularProgress,
    Typography,
    Input,
    InputLabel,
    FormControl
} from '@mui/material';
import { styled } from '@mui/system';
import './UploadForm.css';

const HiddenInput = styled('input')({
    display: 'none',
});

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
        <Box className="upload-form" p={3} borderRadius={2} boxShadow={3} bgcolor="background.paper">
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <HiddenInput
                        id="file-upload"
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload">
                        <Button
                            variant="outlined"
                            color="primary"
                            component="span"
                            fullWidth
                        >
                            {file ? file.name : 'Choose File'}
                        </Button>
                    </label>
                </FormControl>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={uploading}
                    className="upload-button"
                >
                    {uploading ? <CircularProgress size={24} color="inherit" /> : 'Upload'}
                </Button>
            </form>
            {error && <Typography color="error" mt={2}>{error}</Typography>}
        </Box>
    );
};

export default UploadForm;
