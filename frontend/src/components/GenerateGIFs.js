import React, { useState, useEffect } from 'react';
import { generateGIFs } from '../api';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    TextField,
    Typography,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import { styled } from '@mui/system';
import { MuiColorInput } from 'mui-color-input';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));

const defaultTemplate = {
    font_color: "#FFFF00FF",  // Initial color with alpha
    font_size: 144,
    position: "bottom",
    bold: true,
    background_color: "#700000FF", // Initial color with alpha
    padding: 34,
    margin: 8,
    max_words_per_text_frame: 3,
    fps: 10
};

const GenerateGIFs = ({ videoId, segments, setGifTaskId, setGifGenerated, generateGifQueuePosition, setGenerateGifQueuePosition }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [template, setTemplate] = useState(() => {
        const savedTemplate = localStorage.getItem('gif_template');
        return savedTemplate ? JSON.parse(savedTemplate) : defaultTemplate;
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTemplate(prevTemplate => {
            const newTemplate = {
                ...prevTemplate,
                [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
            };
            localStorage.setItem('gif_template', JSON.stringify(newTemplate));
            return newTemplate;
        });
    };

    const handleColorChange = (color, name) => {
        setTemplate(prevTemplate => {
            const newTemplate = {
                ...prevTemplate,
                [name]: color
            };
            localStorage.setItem('gif_template', JSON.stringify(newTemplate));
            return newTemplate;
        });
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
            console.error('Failed to generate GIFs', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={3} borderRadius={2} bgcolor="background.paper">
            <Typography variant="h5" gutterBottom>Template Settings</Typography>
            <br />
            <Grid container spacing={2}>
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
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={template.bold}
                                onChange={handleInputChange}
                                name="bold"
                                color="primary"
                            />
                        }
                        label="Bold Text"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledFormControl fullWidth>
                        <MuiColorInput
                            label="Font Color"
                            value={template.font_color}
                            onChange={color => handleColorChange(color, 'font_color')}
                            format="hex8"  // Use hex8 for alpha support
                            fullWidth
                        />
                    </StyledFormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledFormControl fullWidth>
                        <MuiColorInput
                            label="Background Color"
                            value={template.background_color}
                            onChange={color => handleColorChange(color, 'background_color')}
                            format="hex8"  // Use hex8 for alpha support
                            fullWidth
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
                            label="Max Words Per Text Frame"
                            type="number"
                            name="max_words_per_text_frame"
                            value={template.max_words_per_text_frame}
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
                    {loading ? (
                        <Box display="flex" justifyContent="center">
                            <CircularProgress size={24} color="inherit" />
                        </Box>
                    ) : 'Generate GIFs'}
                </Button>
            </Box>
            {error && <Typography color="error" mt={2}>{error}</Typography>}
        </Box>
    );
};

export default GenerateGIFs;
