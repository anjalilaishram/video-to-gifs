import React, { useState } from 'react';
import { Box, Card, CardMedia, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const GIFDisplay = ({ gifURLs }) => {
    const [selectedGIF, setSelectedGIF] = useState(null);

    const handleGIFClick = (url) => {
        setSelectedGIF(url);
    };

    const closeModal = () => {
        setSelectedGIF(null);
    };

    const addCacheBuster = (url) => {
        return `${url}?timestamp=${new Date().getTime()}`;
    };

    return (
        <Box mt={2} textAlign="center">
            <Typography variant="h5" gutterBottom>Generated GIFs</Typography>
            <br></br>
            <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
                {gifURLs.map((url, index) => (
                    <Card key={index} onClick={() => handleGIFClick(addCacheBuster(url))} sx={{ cursor: 'pointer', maxWidth: 144, maxHeight: 144 }}>
                        <CardMedia
                            component="img"
                            image={addCacheBuster(url)}
                            alt={`GIF ${index}`}
                            sx={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }}
                        />
                    </Card>
                ))}
            </Box>

            <Dialog open={!!selectedGIF} onClose={closeModal} maxWidth="lg">
                <DialogContent sx={{ position: 'relative', p: 0 }}>
                    <IconButton
                        onClick={closeModal}
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            color: 'white',
                            background: 'rgba(0, 0, 0, 0.5)',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <img src={selectedGIF} alt="Selected GIF" style={{ maxWidth: '90%', maxHeight: '90%' }} />
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default GIFDisplay;
