import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const SegmentsDisplay = ({ segments }) => {
    return (
        <Box p={2}>
            <Typography variant="h5" gutterBottom>
                Text Segments
            </Typography>
            <Box display="flex" flexWrap="wrap" mt={1}>
                {segments.map((segment, index) => (
                    <Paper
                        key={index}
                        elevation={1}
                        sx={{ 
                            backgroundColor: '#f8f9fa',
                            padding: '4px 8px',  // Reduced padding with better spacing
                            borderRadius: 1,
                            margin: '4px',  // Adjusted margin for better spacing
                            textAlign: 'center',
                            width: 'fit-content',
                        }}
                    >
                        <Typography variant="body2">{segment.text}</Typography> {/* Smaller typography */}
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};

export default SegmentsDisplay;
