import React, { useState, useEffect, useRef } from 'react';
import { generateGIFs } from '../api';
import LoadingSpinner from './LoadingSpinner';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Slider,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import { styled } from '@mui/system';
import "./GenerateGIFs.css"

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));

const GenerateGIFs = ({ videoId, segments, setGifTaskId, setGifGenerated, generateGifQueuePosition, setGenerateGifQueuePosition }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [template, setTemplate] = useState({
        font_color: "#FFFF00",
        font_size: 144,
        position: "bottom",
        bold: true,
        background_color: "#000000",
        background_opacity: 0.5,
        padding: 34,
        margin: 8,
        max_words: 3,
        fps: 10
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTemplate(prevTemplate => ({
            ...prevTemplate,
            [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
        }));
    };

    const handleGenerateGIFs = async () => {
        setLoading(true);
        setGifGenerated(false);
        setError('');

        try {
            const response = await generateGIFs({ video_id: videoId, segments_list: segments, template });
            setGifTaskId(response.data.task_id);
            localStorage.setItem('gif_task_id', response.data.task_id);
            setGenerateGifQueuePosition(response.data.queue_position);
        } catch (error) {
            setError('Failed to generate GIFs');
            console.log('Failed to generate GIFs', error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="generate-gifs" p={3} borderRadius={2} boxShadow={3} bgcolor="background.paper">
            <Typography variant="h5" gutterBottom>Template Settings</Typography>
            <br></br>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <StyledFormControl fullWidth>
                        <TextField
                            label="Font Color"
                            type="color"
                            name="font_color"
                            value={template.font_color}
                            onChange={handleInputChange}
                            variant="outlined"
                            fullWidth
                        />
                    </StyledFormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledFormControl fullWidth>
                        <TextField
                            label="Font Size"
                            type="number"
                            name="font_size"
                            value={template.font_size}
                            onChange={handleInputChange}
                            variant="outlined"
                            fullWidth
                        />
                    </StyledFormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledFormControl fullWidth>
                        <InputLabel>Position</InputLabel>
                        <Select
                            name="position"
                            value={template.position}
                            onChange={handleInputChange}
                            variant="outlined"
                        >
                            <MenuItem value="top">Top</MenuItem>
                            <MenuItem value="bottom">Bottom</MenuItem>
                            <MenuItem value="center">Center</MenuItem>
                        </Select>
                    </StyledFormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControlLabel
                        control={<Switch checked={template.bold} onChange={handleInputChange} name="bold" />}
                        label="Bold"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledFormControl fullWidth>
                        <TextField
                            label="Background Color"
                            type="color"
                            name="background_color"
                            value={template.background_color}
                            onChange={handleInputChange}
                            variant="outlined"
                            fullWidth
                        />
                    </StyledFormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledFormControl fullWidth>
                        <Typography id="background-opacity-slider" gutterBottom>
                            Background Opacity
                        </Typography>
                        <Slider
                            aria-labelledby="background-opacity-slider"
                            name="background_opacity"
                            value={template.background_opacity}
                            onChange={(e, newValue) => handleInputChange({ target: { name: 'background_opacity', value: newValue } })}
                            step={0.1}
                            min={0}
                            max={1}
                            valueLabelDisplay="auto"
                        />
                    </StyledFormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledFormControl fullWidth>
                        <TextField
                            label="Padding"
                            type="number"
                            name="padding"
                            value={template.padding}
                            onChange={handleInputChange}
                            variant="outlined"
                            fullWidth
                        />
                    </StyledFormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledFormControl fullWidth>
                        <TextField
                            label="Margin"
                            type="number"
                            name="margin"
                            value={template.margin}
                            onChange={handleInputChange}
                            variant="outlined"
                            fullWidth
                        />
                    </StyledFormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledFormControl fullWidth>
                        <TextField
                            label="Max Words"
                            type="number"
                            name="max_words"
                            value={template.max_words}
                            onChange={handleInputChange}
                            variant="outlined"
                            fullWidth
                        />
                    </StyledFormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledFormControl fullWidth>
                        <TextField
                            label="FPS"
                            type="number"
                            name="fps"
                            value={template.fps}
                            onChange={handleInputChange}
                            variant="outlined"
                            fullWidth
                        />
                    </StyledFormControl>
                </Grid>
            </Grid>
            <Box mt={3} className="generate-controls">
                <Button
                    onClick={handleGenerateGIFs}
                    disabled={generateGifQueuePosition !== null || loading}
                    variant="contained"
                    color="primary"
                    className="generate-button"
                    fullWidth
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate GIFs'}
                </Button>
            </Box>
            {error && <Typography color="error" mt={2}>{error}</Typography>}
            {generateGifQueuePosition !== null && (
                <Box mt={2}>
                    <LoadingSpinner small />
                    <Typography mt={2}>Queue Position: {generateGifQueuePosition}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default GenerateGIFs;
